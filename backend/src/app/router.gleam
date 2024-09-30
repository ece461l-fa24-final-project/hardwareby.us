import app/web.{type Context}
import gleam/string_builder
import simplifile
import wisp.{type Request, type Response}

pub fn handle_request(req: Request, ctx: Context) -> Response {
  use _req <- web.middleware(req, ctx)

  let path = static_directory()
  let assert Ok(body) = simplifile.read(path <> "/index.html")

  wisp.html_response(string_builder.from_string(body), 200)
}

pub fn static_directory() -> String {
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  priv_directory <> "/static"
}
