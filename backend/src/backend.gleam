import backend/auth
import backend/db
import backend/router
import gleam/erlang/os
import gleam/erlang/process
import gleam/http/request.{type Request}
import gleam/http/response.{type Response}
import gleam/int
import gleam/list
import gleam/result
import gleam/string
import mist
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()

  let secret_key_base = auth.get_secret()
  let database_name = database_name()
  let static_directory = static_directory()

  // Initialisation that is run per-request
  let make_context = fn() {
    let db = db.connect(database_name)
    router.Context(db: db, static_directory: static_directory)
  }

  let builder =
    handler(router.handle_request(_, make_context), secret_key_base)
    |> mist.new

  let _ = case os.get_env("PRODUCTION") {
    Error(_) -> {
      let assert Ok(result) =
        builder
        |> mist.port(8080)
        |> mist.start_http

      result
    }
    Ok(_) -> {
      let assert Ok(result) =
        builder
        |> mist.port(443)
        |> mist.start_https(
          "/etc/letsencrypt/live/hardwareby.us/fullchain.pem",
          "/etc/letsencrypt/live/hardwareby.us/privkey.pem",
        )

      result
    }
  }

  process.sleep_forever()
}

/// NOTE(isaac): This is a very dumb way to log IPs, but I couldn't think of another way
/// A wrapper that logs the IP of the incoming connection, and then passes it on 
/// to the standard wisp infrastructure.
fn handler(
  handler: fn(wisp.Request) -> wisp.Response,
  secret_key_base: String,
) -> fn(Request(mist.Connection)) -> Response(mist.ResponseData) {
  let fun = wisp_mist.handler(handler, secret_key_base)

  fn(req: Request(_)) {
    let ip =
      mist.get_client_info(req.body)
      |> result.map(fn(x) { x.ip_address })
      |> result.map(ip_to_string)

    case ip {
      Ok(val) -> wisp.log_info("New Connection: " <> val)
      Error(e) -> wisp.log_alert("New Connection Failed: " <> string.inspect(e))
    }

    fun(req)
  }
}

/// Convert an IP into a nicely formatted string
fn ip_to_string(ip: mist.IpAddress) -> String {
  case ip {
    mist.IpV4(a, b, c, d) ->
      [a, b, c, d] |> list.map(int.to_string) |> string.join(".")
    mist.IpV6(a, b, c, d, e, f, g, h) ->
      [a, b, c, d, e, f, g, h] |> list.map(int.to_string) |> string.join(":")
  }
}

pub fn static_directory() -> String {
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  priv_directory <> "/static"
}

fn database_name() -> String {
  case os.get_env("PRODUCTION_DATABASE") {
    Ok(path) -> path
    Error(Nil) -> "./database.sqlite"
  }
}
