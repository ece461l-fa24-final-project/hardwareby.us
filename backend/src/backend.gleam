import app/auth
import app/router
import app/web.{Context}
import gleam/erlang/os
import gleam/erlang/process
import gleam/http/request.{type Request}
import gleam/http/response.{type Response}
import gleam/string
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()

  let is_prod = os.get_env("PRODUCTION")

  let _ = case is_prod {
    Error(_) -> {
      start_dev()
    }
    Ok(_) -> {
      start_prod()
    }
  }

  process.sleep_forever()
}

fn start_dev() {
  let secret_key_base = auth.get_secret()
  let ctx = Context(router.static_directory())

  let assert Ok(result) =
    handler(router.handle_request(_, ctx), secret_key_base)
    |> mist.new
    |> mist.port(8080)
    |> mist.start_http

  result
}

fn start_prod() {
  let secret_key_base = auth.get_secret()
  let ctx = Context(router.static_directory())

  let assert Ok(result) =
    handler(router.handle_request(_, ctx), secret_key_base)
    |> mist.new
    |> mist.port(443)
    |> mist.start_https(
      "/etc/letsencrypt/live/hardwareby.us/fullchain.pem",
      "/etc/letsencrypt/live/hardwareby.us/privkey.pem",
    )

  result
}

fn handler(
  handler: fn(wisp.Request) -> wisp.Response,
  secret_key_base: String,
) -> fn(Request(mist.Connection)) -> Response(mist.ResponseData) {
  let fun = wisp_mist.handler(handler, secret_key_base)

  fn(req: Request(_)) {
    wisp.log_info(
      "New Connection: " <> string.inspect(mist.get_client_info(req.body)),
    )

    fun(req)
  }
}
