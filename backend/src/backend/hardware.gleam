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
