import backend/db
import backend/web
import gleam/io
import gleam/json
import gleam/list
import gleam/result
import gleam/string_builder
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

pub fn get_projects(
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(userid: String) {
    let builder = string_builder.from_string("{\n\t")
    db.get_projects(ctx.db, userid)
    |> result.map(fn(projects: List(web.Project)) {
      list.each(projects, fn(project: web.Project) {
        let builder =
          string_builder.append(
            builder,
            json.to_string(
              json.object([
                #("projectid", json.string(project.projectid)),
                #("name", json.string(project.name)),
                #("description", json.string(project.description)),
              ]),
            ),
          )
      })
      let builder = string_builder.append(builder, "}")
      wisp.response(201)
      |> wisp.string_body(string_builder.to_string(builder))
    })
    |> result.unwrap(or: wisp.bad_request())
  }

  gwt.get_subject(jwt)
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}
