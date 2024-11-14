import backend/error.{type Error, NotFoundError}
import backend/generated/sql
import backend/web
import gleam/dynamic.{type Dynamic} as dyn
import gleam/list
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

pub fn get_user(db: web.Connection, userid: String) -> Result(web.User, Error) {
  let params = [sqlight.text(userid)]
  let decoder =
    dyn.decode2(
      web.User,
      dyn.element(0, dyn.string),
      dyn.element(1, dyn.string),
    )
  let res = sql.get_user(db.inner, params, decoder)

  wisp.log_info("DB get_user " <> string.inspect(userid))

  use returned <- result.then(res)
  list.first(returned)
  |> result.map_error(NotFoundError)
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

pub fn create_project(
  db: web.Connection,
  project: web.Project,
  userid: String,
) -> Result(Nil, Error) {
  let params = [
    sqlight.text(project.projectid),
    sqlight.text(project.name),
    sqlight.text(project.description),
  ]
  let decoder = fn(dyn: Dynamic) { Ok(Nil) }
  let res = sql.create_project(db.inner, params, decoder)

  wisp.log_info("DB create_project " <> string.inspect(res))

  use returned <- result.then(res)
  let assert [] = returned

  let returned = join_project(db, project.projectid, userid)
  let assert Ok(Nil) = returned

  Ok(Nil)
}

pub fn join_project(
  db: web.Connection,
  projectid: String,
  userid: String,
) -> Result(Nil, Error) {
  let decoder = fn(dyn: Dynamic) { Ok(Nil) }
  let params = [sqlight.text(projectid), sqlight.text(userid)]
  let res = sql.add_user_to_project(db.inner, params, decoder)

  wisp.log_info("DB add_user_to_project " <> string.inspect(res))

  use returned <- result.then(res)
  let assert [] = returned

  Ok(Nil)
}

pub fn get_projects(
  db: web.Connection,
  userid: String,
) -> Result(List(web.Project), Error) {
  let decoder =
    dyn.decode3(
      web.Project,
      dyn.element(0, dyn.string),
      dyn.element(1, dyn.string),
      dyn.element(2, dyn.string),
    )
  let params = [sqlight.text(userid)]
  let res = sql.get_projects(db.inner, params, decoder)

  wisp.log_info("DB get_projects " <> string.inspect(res))

  use returned <- result.then(res)
  Ok(returned)
}

pub fn create_hardware_set(
  db: web.Connection,
  projectid: String,
  name: String,
) -> Result(Int, Error) {
  let decoder = fn(dyn: Dynamic) { Ok(Nil) }
  let params = [
    sqlight.text(projectid),
    sqlight.text(name),
    sqlight.int(100),
    // Hardcoded 100 capacity for now
  ]
  let res = sql.create_hardware_set(db.inner, params, decoder)
  wisp.log_info("DB create_hardware_set " <> string.inspect(res))

  let res = sql.get_last_rowid(db.inner, [], dyn.element(0, dyn.int))
  wisp.log_info("DB get_last_rowid " <> string.inspect(res))

  use returned <- result.then(res)
  list.first(returned)
  |> result.map_error(NotFoundError)
}

pub fn get_hardware_set(
  db: web.Connection,
  set_id: Int,
) -> Result(web.HardwareSet, Error) {
  let params = [sqlight.int(set_id)]
  let decoder =
    dyn.decode5(
      web.HardwareSet,
      dyn.element(0, dyn.int),
      dyn.element(1, dyn.string),
      dyn.element(2, dyn.string),
      dyn.element(3, dyn.int),
      dyn.element(4, dyn.int),
    )
  let res = sql.get_hardware_set(db.inner, params, decoder)

  wisp.log_info("DB get_hardware_set " <> string.inspect(res))

  use returned <- result.then(res)
  list.first(returned)
  |> result.map_error(NotFoundError)
  // This should never happen...
}

pub fn get_hardware_sets(
  db: web.Connection,
  projectid: String,
) -> Result(List(web.HardwareSet), Error) {
  let params = [sqlight.text(projectid)]
  let decoder =
    dyn.decode5(
      web.HardwareSet,
      dyn.element(0, dyn.int),
      dyn.element(1, dyn.string),
      dyn.element(2, dyn.string),
      dyn.element(3, dyn.int),
      dyn.element(4, dyn.int),
    )
  let res = sql.get_hardware_sets(db.inner, params, decoder)

  wisp.log_info("DB get_hardware_sets " <> string.inspect(res))

  use returned <- result.then(res)
  Ok(returned)
}
