import backend
import backend/db
import backend/router
import backend/web
import gleam/io
import gleam/string_builder
import gleeunit
import gleeunit/should
import wisp
import wisp/testing

pub fn main() {
  gleeunit.main()
}

fn with_database(f: fn(web.Connection) -> t) -> t {
  let db = db.connect(":memory:")
  let t = f(db)
  t
}

fn with_logger(testcase: fn() -> t) -> t {
  wisp.configure_logger()

  io.println_error("")
  testcase()
}

fn with_context(testcase: fn(fn() -> web.Context) -> t) -> t {
  use db <- with_database()
  // Create context to use in tests
  let context = fn() {
    web.Context(db, static_directory: backend.static_directory())
  }

  // Run the testcase with the context
  testcase(context)
}

pub fn get_home_page_test() {
  use ctx <- with_context

  let request = testing.get("/", [])
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(200)

  response.headers
  |> should.equal([#("content-type", "text/html; charset=utf-8")])
}

pub fn auth_api_create_user_test() {
  use ctx <- with_context

  // 1. Test that we can create a user
  let request =
    testing.post("/api/v1/auth/signup?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)
}

pub fn auth_api_cant_create_duplicate_user_test() {
  use ctx <- with_context

  // 1. Test that we can create a user
  let request =
    testing.post("/api/v1/auth/signup?userid=foo1&password=bar1", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // 2. Test that we can't create an identical user
  let request =
    testing.post("/api/v1/auth/signup?userid=foo1&password=bar1", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)
}

pub fn auth_api_test() {
  use ctx <- with_context
  // use <- with_logger

  // 1. Test that we can create a user
  let request =
    testing.post("/api/v1/auth/signup?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // 2. Test that we can't create an identical user
  let request =
    testing.post("/api/v1/auth/signup?userid=foo&password=bar2", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)

  // 3. Test that we can get an auth token when signing in
  let request =
    testing.post("/api/v1/auth/login?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  response.headers
  |> should.equal([#("content-type", "application/json; charset=utf-8")])
}

pub fn project_api_create_project_test() {
  use ctx <- with_context
  use <- with_logger

  // need to create and log in user before we can test the project creation
  let request =
    testing.post("/api/v1/auth/signup?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  let request =
    testing.post("/api/v1/auth/login?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  response.headers
  |> should.equal([#("content-type", "application/json; charset=utf-8")])

  let assert wisp.Text(jwt) = response.body
  let token = string_builder.to_string(jwt)

  // now we can test creating the project
  let request =
    testing.post(
      "/api/v1/project/foo?description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)
}

pub fn project_api_cant_create_identical_project_test() {
  use ctx <- with_context
  use <- with_logger

  // need to create and log in user before we can test the project creation
  let request =
    testing.post("/api/v1/auth/signup?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  let request =
    testing.post("/api/v1/auth/login?userid=foo&password=bar", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  response.headers
  |> should.equal([#("content-type", "application/json; charset=utf-8")])

  let assert wisp.Text(jwt) = response.body
  let token = string_builder.to_string(jwt)

  // now we can test creating the project
  let request =
    testing.post(
      "/api/v1/project/foo?description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Test that we can't create an identical project
  let request =
    testing.post(
      "/api/v1/project/99?description=foobar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)
}
// pub fn project_api_test() {
//   use ctx <- with_context

//   // Test that we can create a project
//   let request = testing.post("/api/v1/project/99?description=foobar", [], "")
//   let response = router.handle_request(request, ctx)

//   response.status
//   |> should.equal(201)

//   // Test that we can't create an identical project
//   let request = testing.post("/api/v1/project/99?description=foobar", [], "")
//   let response = router.handle_request(request, ctx)

//   response.status
//   |> should.equal(400)

//   // Test that we can get a project
//   let request = testing.get("/api/v1/project/99", [])
//   let response = router.handle_request(request, ctx)

//   response.status
//   |> should.equal(201)

//   // Test that we can add a user to a project
//   let request = testing.put("/api/v1/project/99?userid=0", [], "")
//   let response = router.handle_request(request, ctx)

//   response.status
//   |> should.equal(201)

//   // Test that we can delete a project
//   let request = testing.delete("/api/v1/project/99", [], "")
//   let response = router.handle_request(request, ctx)

//   response.status
//   |> should.equal(201)
// }
