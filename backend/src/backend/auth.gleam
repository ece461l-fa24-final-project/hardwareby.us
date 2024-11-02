import birl
import gleam/erlang/os
import gleam/result
import gwt
import simplifile
import wisp

pub type User {
  User(userid: String, password: String)
}

pub fn generate_jwt(userid: String) -> String {
  let day_in_seconds = 86_400

  let builder =
    gwt.new()
    |> gwt.set_issuer("hardwareby.us")
    |> gwt.set_subject(userid)
    |> gwt.set_audience("hardwareby.us")
    |> gwt.set_issued_at(birl.to_unix(birl.now()))
    |> gwt.set_expiration(birl.to_unix(birl.now()) + day_in_seconds)

  gwt.to_signed_string(builder, gwt.HS256, get_secret())
}

pub fn verify_jwt(jwt: String) -> Bool {
  let is_valid =
    jwt
    |> gwt.from_signed_string(get_secret())

  result.is_ok(is_valid)
}

pub fn get_secret() -> String {
  case os.get_env("PRODUCTION") {
    Error(_) -> {
      let assert Ok(path) = wisp.priv_directory("backend")
      let assert Ok(key) = simplifile.read(path <> "/key.txt")
      key
    }
    Ok(_) -> {
      let assert Ok(key) = os.get_env("PRODUCTION_KEY")
      key
    }
  }
}
