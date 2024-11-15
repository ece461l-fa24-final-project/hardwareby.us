import backend/auth
import backend/hardware
import backend/project
import backend/web.{type Context}
import gleam/bit_array
import gleam/bytes_builder
import gleam/http.{Delete, Get, Post, Put}
import gleam/int
import gleam/list
import gleam/order
import gleam/result
import gleam/string
import gleam/string_builder
import gwt
import gzlib
import simplifile
import wisp

pub fn handle_request(
  req: wisp.Request,
  make_context: fn() -> Context,
) -> wisp.Response {
  let ctx = make_context()
  use _req <- middleware(req, ctx)

  case wisp.path_segments(req) {
    ["api", "v1", "auth", ..] -> auth(req, ctx)
    ["api", "v1", "project", ..] -> project(req, ctx)
    ["api", "v1", "hardware", ..] -> hardware(req, ctx)
    _ -> {
      let index = case simplifile.read(ctx.static_directory <> "/index.html") {
        Ok(file) -> file
        _ -> "Hello, Joe!"
      }
      wisp.html_response(string_builder.from_string(index), 200)
    }
  }
}

pub fn middleware(
  req: wisp.Request,
  ctx: Context,
  handle_request: fn(wisp.Request) -> wisp.Response,
) -> wisp.Response {
  use <- wisp.rescue_crashes
  use <- wisp.serve_static(req, under: "", from: ctx.static_directory)

  let res = handle_request(req)

  // Compress the response if supported
  let accept_encoding =
    req.headers
    |> list.find_map(fn(header) {
      case header.0 == "accept-encoding" {
        True -> Ok(header.1)
        False -> Error(Nil)
      }
    })
    |> result.unwrap("")
    |> string.split(",")
    |> list.map(string.trim)

  let deflate_accepted = accept_encoding |> list.contains("deflate")

  case res.body, deflate_accepted {
    wisp.Text(body), True ->
      res
      |> wisp.set_header("content-encoding", "deflate")
      |> wisp.set_body(
        body
        |> string_builder.to_string
        |> bit_array.from_string
        |> gzlib.compress
        |> bytes_builder.from_bit_array
        |> wisp.Bytes,
      )
    _, _ -> res
  }
}

pub fn auth(req: wisp.Request, ctx: Context) -> wisp.Response {
  let assert ["api", "v1", "auth", ..route] = wisp.path_segments(req)

  case route {
    ["login"] -> {
      use <- wisp.require_method(req, http.Post)

      use params <- get_required_query(req, ["userid", "password"])
      let assert [userid, password] = params

      auth.check_user(web.User(userid, password), ctx)
    }
    ["signup"] -> {
      // XXX: We can potentiall have a GET method to check if a userid is available if needed
      use <- wisp.require_method(req, http.Post)

      use params <- get_required_query(req, ["userid", "password"])
      let assert [userid, password] = params

      auth.create_user(web.User(userid, password), ctx)
    }
    _ -> wisp.bad_request()
  }
}

// Privileged API
pub fn project(req: wisp.Request, ctx: Context) -> wisp.Response {
  let assert ["api", "v1", "project", ..route] = wisp.path_segments(req)

  use jwt <- get_required_auth(req)

  case route {
    [] -> {
      // List of projects the user has joined
      use <- wisp.require_method(req, http.Get)
      project.get_projects(jwt, ctx)
    }
    [projectid] -> {
      case req.method {
        // Get -> {
        //   // Get details for a specific project
        //   wisp.response(501)
        // }
        Post -> {
          // Create a new project
          use params <- get_required_query(req, ["name", "description"])
          let assert [name, description] = params

          project.create_project(
            web.Project(projectid, name, description),
            jwt,
            ctx,
          )
        }
        Put -> {
          // Add calling user to a project
          project.join_project(projectid, jwt, ctx)
        }
        // Delete -> {
        //   // Delete a project (and associated user connections)
        //   use <- wisp.require_method(req, http.Delete)
        //   wisp.response(501)
        // }
        // XXX: Add other api calls later
        _ -> wisp.method_not_allowed(allowed: [http.Post])
      }
    }
    _ -> wisp.bad_request()
  }
}

// Privileged API
pub fn hardware(req: wisp.Request, ctx: Context) -> wisp.Response {
  let assert ["api", "v1", "hardware", ..route] = wisp.path_segments(req)
  use jwt <- get_required_auth(req)

  case route {
    [] -> {
      use <- wisp.require_method(req, http.Post)
      use params <- get_required_query(req, ["projectid", "name"])
      let assert [projectid, name] = params

      hardware.create_hardware_set(projectid, name, jwt, ctx)
    }
    [hardwaresetid] -> {
      use <- wisp.require_method(req, http.Get)
      int.parse(hardwaresetid)
      |> result.map(fn(id: Int) { hardware.get_hardware_set(id, jwt, ctx) })
      |> result.unwrap(or: wisp.bad_request())
    }
    ["checkout", setid] -> {
      case req.method {
        Put -> {
          use params <- get_required_query(req, ["count"])
          let assert [count] = params

          case int.parse(setid), int.parse(count) {
            Ok(setid), Ok(count) ->
              hardware.checkout_hardware_set(setid, count, jwt, ctx)
            _, _ -> wisp.bad_request()
          }
        }
        _ -> wisp.method_not_allowed(allowed: [http.Put])
      }
    }
    ["checkin", setid] -> {
      case req.method {
        Put -> {
          use params <- get_required_query(req, ["count"])
          let assert [count] = params

          case int.parse(setid), int.parse(count) {
            Ok(setid), Ok(count) ->
              hardware.checkin_hardware_set(setid, count, jwt, ctx)
            _, _ -> wisp.bad_request()
          }
        }
        _ -> wisp.method_not_allowed(allowed: [http.Put])
      }
    }
    _ -> wisp.bad_request()
  }
}

fn get_required_query(
  req: wisp.Request,
  params: List(String),
  next: fn(List(String)) -> wisp.Response,
) -> wisp.Response {
  let query = wisp.get_query(req)

  let mapper = fn(param: String) { list.key_find(query, param) }

  let vals =
    params
    |> list.try_map(mapper)

  case vals {
    Ok(params) -> next(params)
    Error(_) -> {
      wisp.log_info("Invalid Query Param")
      wisp.bad_request()
    }
  }
}

/// Require the request to have a valid authorization header
fn get_required_auth(
  req: wisp.Request,
  next: fn(gwt.Jwt(gwt.Verified)) -> wisp.Response,
) -> wisp.Response {
  let auth =
    req.headers
    |> list.key_find("authorization")
    |> result.try(get_required_auth_type)
    |> result.try(fn(jwt: String) {
      gwt.from_signed_string(jwt, auth.get_secret())
      |> result.map_error(fn(_) { Nil })
    })

  case auth {
    Ok(jwt) -> {
      next(jwt)
    }
    Error(_) -> wisp.response(401)
  }
}

fn get_required_auth_type(header: String) -> Result(String, Nil) {
  case string.split_once(header, " ") {
    Error(_) -> Error(Nil)
    Ok(#(auth, token)) -> {
      case string.compare(auth, "Bearer") {
        order.Eq -> Ok(token)
        _ -> Error(Nil)
      }
    }
  }
}
