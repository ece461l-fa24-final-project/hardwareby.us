import app/router
import gleam/erlang/os
import gleam/erlang/process
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
  let secrect_key_base = wisp.random_string(64)
  let assert Ok(result) =
    wisp_mist.handler(router.handle_request, secrect_key_base)
    |> mist.new
    |> mist.port(8080)
    |> mist.start_http

  result
}

fn start_prod() {
  let secrect_key_base = wisp.random_string(64)
  let assert Ok(result) =
    wisp_mist.handler(router.handle_request, secrect_key_base)
    |> mist.new
    |> mist.port(443)
    |> mist.start_https(
      "/etc/letsencrypt/live/hardwareby.us/fullchain.pem",
      "/etc/letsencrypt/live/hardwareby.us/privkey.pem",
    )

  result
}
