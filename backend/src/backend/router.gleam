import backend/web.{type Context}
import gleam/string_builder
import simplifile
import wisp.{type Request, type Response}

pub fn handle_request(req: Request, ctx: Context) -> Response {
  use _req <- web.middleware(req, ctx)

  case wisp.path_segments(req) {
    [] -> {
      let index = case simplifile.read(ctx.static_directory <> "/index.html") {
        Ok(file) -> file
        _ -> "Hello, Joe!"
      }
      wisp.html_response(string_builder.from_string(index), 200)
    }
    ["api", "v1", "auth", ..] -> web.auth(req, ctx)
    ["api", "v1", "project", ..] -> web.project(req, ctx)
    ["api", "v1", "hardware", ..] -> web.hardware(req, ctx)
    _ -> wisp.not_found()
  }
}
