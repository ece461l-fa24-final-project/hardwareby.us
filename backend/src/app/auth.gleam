import birl
import gwt
import gleam/json
import gleam/result
import simplifile
import wisp

pub fn generate_jwt(userid: Int, username: String) {
  let builder =
    gwt.new()
    |> gwt.set_issuer("hardwareby.us")
    |> gwt.set_subject(username)
    |> gwt.set_audience("hardwareby.us")
    |> gwt.set_issued_at(birl.to_unix(birl.now()))
    |> gwt.set_expiration(birl.to_unix(birl.now()) + 600)
    |> gwt.set_payload_claim("userid", json.int(userid))

  let signed_jwt = gwt.to_signed_string(builder, gwt.HS256, get_key())
  signed_jwt
}

pub fn verify_jwt(jwt: String) {
  let is_valid = jwt
  |> gwt.from_signed_string(get_key())

  result.is_ok(is_valid)
}

fn get_key() {
  let assert Ok(path) = wisp.priv_directory("backend")
  let assert Ok(key) = simplifile.read(path <> "/key.txt")
  key
}