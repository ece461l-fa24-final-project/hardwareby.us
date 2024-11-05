import backend/db
import backend/web
import gleam/result
import wisp

pub fn create_project(
  project: web.Project,
  userid: String,
  ctx: web.Context,
) -> wisp.Response {
  db.create_project(ctx.db, project, userid)
  |> result.map(fn(_) { wisp.response(201) })
  |> result.unwrap(or: wisp.bad_request())
}
