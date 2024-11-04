import backend/error.{type Error}
import backend/generated/sql
import backend/web
import gleam/dynamic.{type DecodeError, type Dynamic, DecodeError} as dyn
import gleam/http/request
import gleam/result
import gleam/string
import simplifile
import sqlight
import wisp

pub fn connect(database: String) -> web.Connection {
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  let assert Ok(schema) = simplifile.read(priv_directory <> "/schema.sql")
  let assert Ok(db) = sqlight.open(database)
  let assert Ok(_) = sqlight.exec(schema, db)
  web.Connection(db)
}

pub fn create_user(db: web.Connection, user: web.User) -> Result(Nil, Error) {
  let params = [sqlight.text(user.userid), sqlight.text(user.password)]
  let decoder = fn(dyn: Dynamic) { Ok(Nil) }
  let res = sql.create_user(db.inner, params, decoder)

  wisp.log_info("DB create_user " <> string.inspect(res))

  use returned <- result.then(res)
  let assert [] = returned
  Ok(Nil)
}

pub fn check_user(db: web.Connection, user: web.User) -> Result(Bool, Error) {
  let params = [sqlight.text(user.userid), sqlight.text(user.password)]
  let res = sql.check_user(db.inner, params, sqlight.decode_bool)
  use returned <- result.then(res)
  let assert [status] = returned
  Ok(status)
}
