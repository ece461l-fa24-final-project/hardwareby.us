import app/web.{type Context}
import wisp.{type Request, type Response}

pub fn handle_request(req: Request, ctx: Context) -> Response {
  use req <- web.middleware(req, ctx)

  case wisp.path_segments(req) {
    ["api", "v1", "auth", ..] -> web.auth(req, ctx)
    ["api", "v1", "project", ..] -> web.project(req, ctx)
    ["api", "v1", "hardwre", ..] -> web.hardware(req, ctx)
    _ -> wisp.redirect(to: "/")
  }
}
