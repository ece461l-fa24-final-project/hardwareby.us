import backend/db
import gleam/bit_array
import gleam/bytes_builder
import gleam/list
import gleam/result
import gleam/string
import gleam/string_builder
import gzlib
import simplifile
import wisp

pub type Context {
  Context(db: db.Connection, static_directory: String)
}

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
      wisp.response(501)
    }
    ["signup"] -> {
      wisp.response(501)
    }
    _ -> wisp.not_found()
  }
}

pub fn project(req: wisp.Request, ctx: Context) -> wisp.Response {
  wisp.response(501)
}

pub fn hardware(req: wisp.Request, ctx: Context) -> wisp.Response {
  wisp.response(501)
}
