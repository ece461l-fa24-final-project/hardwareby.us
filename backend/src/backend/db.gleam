import backend/error.{type Error}
import backend/generated/sql
import backend/web
import gleam/dynamic.{type DecodeError, type Dynamic, DecodeError} as dyn
import gleam/result
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
  let decoder = dyn.element(0, dyn.int)
  use returned <- result.then(sql.create_user(db.inner, params, decoder))
  let assert [] = returned
  Ok(Nil)
}
