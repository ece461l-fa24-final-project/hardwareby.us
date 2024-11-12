import backend/db
import backend/web
import gleam/result
import gwt
import wisp

pub fn create_hardware_set(
  hardware_set: web.HardwareSet,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let mapper = fn(userid: String) {
    db.create_hardware_set(ctx.db, hardware_set)
    |> result.map(fn(_) { wisp.response(201) })
    |> result.unwrap(or: wisp.bad_request())
  }

  gwt.get_subject(jwt)
  |> result.map(mapper)
  |> result.unwrap(or: wisp.response(401))
}

pub fn checkin_hardware_set(
  set_id: Int,
  count: Int,
  jwt: gwt.Jwt(gwt.Verified),
  ctx: web.Context,
) -> wisp.Response {
  let hardware_set =
    db.get_hardware_set(ctx.db, set_id)
    |> result.unwrap(or: web.HardwareSet(-1, "", "", 0, 0))

  let sum = hardware_set.available + count
  case sum {
    i if i <= hardware_set.capacity -> {
      db.update_hardware_set_capacity(ctx.db, set_id, count)
      |> result.map(fn(_) { wisp.response(200) })
      |> result.unwrap(or: wisp.bad_request())
    }
    _ -> wisp.bad_request()
  }
}
