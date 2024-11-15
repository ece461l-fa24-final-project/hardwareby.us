import backend/db
import backend/web
import gleam/int
import gleam/json.{type Json}
import gleam/result
import gleam/string_builder
import gwt
import wisp

pub fn create_hardware_set(
  projectid: String,
  name: String,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(_) {
    db.create_hardware_set(ctx.db, projectid, name)
    |> result.map(fn(id: Int) {
      int.to_string(id)
      |> string_builder.from_string
      |> wisp.json_response(201)
    })
    |> result.unwrap(or: wisp.bad_request())
  }

  gwt.get_subject(jwt)
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}

pub fn checkout_hardware_set(
  set_id: Int,
  count: Int,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let count = int.absolute_value(count)
  let hardware_set =
    db.get_hardware_set(ctx.db, set_id)
    |> result.unwrap(or: web.HardwareSet(-1, "", "", 0, 0))

  let difference = hardware_set.available - count
  case hardware_set.id, difference {
    id, diff if id != -1 && diff >= 0 -> {
      db.update_hardware_set_capacity(ctx.db, set_id, difference)
      |> result.map(fn(_) { wisp.response(200) })
      |> result.unwrap(or: wisp.bad_request())
    }
    _, _ -> wisp.bad_request()
  }
}

pub fn checkin_hardware_set(
  set_id: Int,
  count: Int,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let count = int.absolute_value(count)
  let hardware_set =
    db.get_hardware_set(ctx.db, set_id)
    |> result.unwrap(or: web.HardwareSet(-1, "", "", 0, 0))

  let sum = hardware_set.available + count
  case hardware_set.id, sum {
    id, sum if id != -1 && sum <= hardware_set.capacity -> {
      db.update_hardware_set_capacity(ctx.db, set_id, sum)
      |> result.map(fn(_) { wisp.response(200) })
      |> result.unwrap(or: wisp.bad_request())
    }
    _, _ -> wisp.bad_request()
  }
}

pub fn get_hardware_set(
  set_id: Int,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(set_id: Int) {
    db.get_hardware_set(ctx.db, set_id)
    |> result.map(fn(hardware_set: web.HardwareSet) {
      json.object([
        #("id", json.int(hardware_set.id)),
        #("projectid", json.string(hardware_set.projectid)),
        #("name", json.string(hardware_set.name)),
        #("capacity", json.int(hardware_set.capacity)),
        #("available", json.int(hardware_set.available)),
      ])
    })
    |> result.unwrap(
      or: json.object([
        #(
          "error",
          json.string("An error occured while processing your request"),
        ),
      ]),
    )
    |> json.to_string_builder
    |> wisp.json_response(200)
  }

  gwt.get_subject(jwt)
  |> result.map(fn(_) { set_id })
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}

pub fn get_hardware_sets(
  projectid: String,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(projectid: String) {
    db.get_hardware_sets(ctx.db, projectid)
    |> result.map(fn(hardware_sets: List(web.HardwareSet)) {
      json.array(
        from: hardware_sets,
        of: fn(hardware_set: web.HardwareSet) -> Json {
          json.object([
            #("id", json.int(hardware_set.id)),
            #("projectid", json.string(hardware_set.projectid)),
            #("name", json.string(hardware_set.name)),
            #("capacity", json.int(hardware_set.capacity)),
            #("available", json.int(hardware_set.available)),
          ])
        },
      )
    })
    |> result.unwrap(
      or: json.object([
        #(
          "error",
          json.string("An error occured while processing your request"),
        ),
      ]),
    )
    |> json.to_string_builder
    |> wisp.json_response(200)
  }

  gwt.get_subject(jwt)
  |> result.map(fn(_) { projectid })
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}
