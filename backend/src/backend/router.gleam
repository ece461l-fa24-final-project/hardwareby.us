import backend/auth
import backend/web.{type Context}
import gleam/bit_array
import gleam/bytes_builder
import gleam/http
import gleam/list
import gleam/result
import gleam/string
import gleam/string_builder
import gzlib
import simplifile
import wisp

pub fn handle_request(
  req: wisp.Request,
  make_context: fn() -> Context,
) -> wisp.Response {
  let ctx = make_context()
  use _req <- middleware(req, ctx)

  case wisp.path_segments(req) {
    [] -> {
      let index = case simplifile.read(ctx.static_directory <> "/index.html") {
        Ok(file) -> file
        _ -> "Hello, Joe!"
      }
      wisp.html_response(string_builder.from_string(index), 200)
    }
    ["api", "v1", "auth", ..] -> auth(req, ctx)
    ["api", "v1", "project", ..] -> project(req, ctx)
    ["api", "v1", "hardware", ..] -> hardware(req, ctx)
    _ -> wisp.not_found()
  }
}

pub fn middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(wisp.Request) -> wisp.Response,
) -> wisp.Response {
  use <- wisp.rescue_crashes
  use <- wisp.serve_static(req, under: "", from: ctx.static_directory)

  let res = handle_request(req)

  // Compress the response if supported
  let accept_encoding =
    req.headers
    |> list.find_map(fn(header) {
      case header.0 == "accept-encoding" {
        True -> Ok(header.1)
        False -> Error(Nil)
      }
    })
    |> result.unwrap("")
    |> string.split(",")
    |> list.map(string.trim)

  let deflate_accepted = accept_encoding |> list.contains("deflate")

  case res.body, deflate_accepted {
    wisp.Text(body), True ->
      res
      |> wisp.set_header("content-encoding", "deflate")
      |> wisp.set_body(
        body
        |> string_builder.to_string
        |> bit_array.from_string
        |> gzlib.compress
        |> bytes_builder.from_bit_array
        |> wisp.Bytes,
      )
    _, _ -> res
  }
}

pub fn auth(req: wisp.Request, ctx: Context) -> wisp.Response {
  let assert ["api", "v1", "auth", ..route] = wisp.path_segments(req)

  case route {
    ["login"] -> {
      use <- wisp.require_method(req, http.Get)

      use params <- get_required_query(req, ["userid", "password"])
      let assert [userid, password] = params

      auth.create_user(web.User(userid, password), ctx)
    }
    ["signup"] -> {
      // XXX: We can potentiall have a GET method to check if a userid is available if needed
      use <- wisp.require_method(req, http.Post)

      use params <- get_required_query(req, ["userid", "password"])
      let assert [userid, password] = params

      wisp.response(501)
    }
    _ -> wisp.bad_request()
  }
}

pub fn project(req: wisp.Request, ctx: Context) -> wisp.Response {
  wisp.response(501)
}

pub fn hardware(req: wisp.Request, ctx: Context) -> wisp.Response {
  wisp.response(501)
}

fn get_required_query(
  req: wisp.Request,
  params: List(String),
  next: fn(List(String)) -> wisp.Response,
) -> wisp.Response {
  let query = wisp.get_query(req)

  let mapper = fn(param: String) { list.key_find(query, param) }

  let vals =
    params
    |> list.try_map(mapper)

  case vals {
    Ok(params) -> next(params)
    Error(_) -> wisp.bad_request()
  }
}
