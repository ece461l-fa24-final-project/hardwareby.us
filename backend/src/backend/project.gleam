import backend/db
import backend/web
import gleam/result
import wisp

pub fn create_project(
  projectid: String,
  userid: String,
  ctx: web.Context,
) -> wisp.Response {
  db.create_project(ctx.db, projectid, userid)
  |> result.map(fn(_) { wisp.response(201) })
  |> result.unwrap(or: wisp.bad_request())
}
