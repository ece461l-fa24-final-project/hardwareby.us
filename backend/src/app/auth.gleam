import birl
import gwt.{type Jwt, type Verified}

pub fn generate_jwt(username: String) {
  let builder =
    gwt.new()
    |> gwt.set_issuer("hardwareby.us")
    |> gwt.set_subject(username)
    |> gwt.set_audience("hardwareby.us")
    |> gwt.set_issued_at(birl.to_unix(birl.now()))
    |> gwt.set_expiration(birl.to_unix(birl.now()) + 600)

  let signed_jwt = gwt.to_signed_string(builder, gwt.HS256, "secretKeyHere")

  signed_jwt
}
