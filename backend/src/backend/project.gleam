import backend/db
import backend/web
import gleam/json.{type Json}
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
    |> result.map(fn(_) {
      let _ =
        db.create_hardware_set(
          ctx.db,
          web.HardwareSet(project.projectid, "Hardware Set 1", 100, 100),
        )
      let _ =
        db.create_hardware_set(
          ctx.db,
          web.HardwareSet(project.projectid, "Hardware Set 2", 100, 100),
        )
      wisp.response(201)
    })
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
    db.get_projects(ctx.db, userid)
    |> result.map(fn(projects: List(web.Project)) {
      json.array(from: projects, of: fn(project: web.Project) -> Json {
        json.object([
          #("projectid", json.string(project.projectid)),
          #("name", json.string(project.name)),
          #("description", json.string(project.description)),
        ])
      })
    })
    |> result.unwrap(
      or: json.object([
        #(
          "error",
          json.string("An error occured while processing your request."),
        ),
      ]),
    )
    |> json.to_string_builder
    |> wisp.json_response(200)
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
