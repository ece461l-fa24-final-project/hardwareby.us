import backend/db
import backend/web
import beecrypt
import birl
import gleam/erlang/os
import gleam/result
import gleam/string
import gleam/string_builder
import gwt
import simplifile
import wisp

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

pub fn create_user(user: web.User, ctx: web.Context) -> wisp.Response {
  // Beecrypt generates a salt and stores it in the hash string, which it parses out later when verifying.
  let hash = beecrypt.hash(user.password)
  let user = web.User(user.userid, hash)

  db.create_user(ctx.db, user)
  |> result.map(fn(_) { wisp.response(201) })
  |> result.unwrap(or: wisp.bad_request())
}

pub fn check_user(user: web.User, ctx: web.Context) -> wisp.Response {
  let db_hash =
    db.get_user(ctx.db, user.userid)
    |> result.map(fn(db_user: web.User) { db_user.password })
    |> result.unwrap(or: "")

  let assert False = string.is_empty(db_hash)

  case beecrypt.verify(user.password, db_hash) {
    True -> {
      generate_jwt(user.userid)
      |> string_builder.from_string
      |> wisp.json_response(201)
    }
    False -> wisp.bad_request()
  }
}
