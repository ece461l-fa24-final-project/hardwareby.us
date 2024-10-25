import gleam/bit_array
import gleam/bytes_builder
import gleam/list
import gleam/result
import gleam/string
import gleam/string_builder
import gzlib
import wisp

pub type Context {
  Context(static_directory: String)
}

pub fn middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(wisp.Request) -> wisp.Response,
) -> wisp.Response {
  use <- wisp.log_request(req)
  use <- wisp.rescue_crashes
  use <- wisp.serve_static(req, under: "/", from: ctx.static_directory)

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
  todo
}

pub fn project(req: wisp.Request, ctx: Context) -> wisp.Response {
  todo
}

pub fn hardware(req: wisp.Request, ctx: Context) -> wisp.Response {
  todo
}
