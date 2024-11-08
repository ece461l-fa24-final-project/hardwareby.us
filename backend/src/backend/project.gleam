import backend/db
import backend/web
import gleam/result
import gwt
import wisp

pub fn create_project(
  project: web.Project,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(userid: String) {
    db.create_project(ctx.db, project, userid)
    |> result.map(fn(_) { wisp.response(201) })
    |> result.unwrap(or: wisp.bad_request())
  }

  gwt.get_subject(jwt)
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}

pub fn join_project(
  projectid: String,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(userid: String) {
    db.join_project(ctx.db, projectid, userid)
    |> result.map(fn(_) { wisp.response(201) })
    |> result.unwrap(or: wisp.bad_request())
  }

  gwt.get_subject(jwt)
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}
