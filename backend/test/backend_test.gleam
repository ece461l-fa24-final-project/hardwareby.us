import backend
import backend/db
import backend/router
import backend/web
import gleam/io
import gleam/json.{type Json}
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

/// Automatically includes "Bearer " before token
fn with_bearer_token(ctx: fn() -> web.Context, testcase: fn(String) -> t) -> t {
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

  testcase("Bearer " <> token)
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
  use token <- with_bearer_token(ctx)

  // now we can test creating the project
  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=bar",
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
  use token <- with_bearer_token(ctx)

  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Test that we can't create a project with the same projectid
  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=foo",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)
}

pub fn hardware_api_create_hardware_set_test() {
  use ctx <- with_context
  use <- with_logger
  use token <- with_bearer_token(ctx)

  // Create project so we can create a set
  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Create a new hardware set
  let request =
    testing.post(
      "/api/v1/hardware?projectid=foo&name=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)
}

pub fn project_api_join_project_test() {
  use ctx <- with_context
  use <- with_logger
  use token <- with_bearer_token(ctx)

  // Create a test project which we'll be automatically added to.
  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Try joining the same project, which should fail
  let request =
    testing.put("/api/v1/project/foo", [#("authorization", token)], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)

  // Try joining a non existent project, which should fail
  let request =
    testing.put("/api/v1/project/bar", [#("authorization", token)], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(400)

  // New user to join an existing project
  let request =
    testing.post("/api/v1/auth/signup?userid=bar&password=foo", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  let request =
    testing.post("/api/v1/auth/login?userid=bar&password=foo", [], "")
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  response.headers
  |> should.equal([#("content-type", "application/json; charset=utf-8")])

  let assert wisp.Text(jwt) = response.body
  let token = string_builder.to_string(jwt)

  // Try joining an existing project as a new user.
  let request =
    testing.put(
      "/api/v1/project/foo",
      [#("authorization", "Bearer " <> token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)
}

pub fn project_api_get_projects_test() {
  use ctx <- with_context
  use <- with_logger
  use token <- with_bearer_token(ctx)

  // Create a project
  let request =
    testing.post(
      "/api/v1/project/foo?name=Foo&description=bar",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Create a second project
  let request =
    testing.post(
      "/api/v1/project/bar?name=Bar&description=foo",
      [#("authorization", token)],
      "",
    )
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(201)

  // Get projects
  let request = testing.get("/api/v1/project", [#("authorization", token)])
  let response = router.handle_request(request, ctx)

  response.status
  |> should.equal(200)

  response.body
  |> should.equal(wisp.Text(
    json.array(
      from: [web.Project("bar", "Bar", "foo"), web.Project("foo", "Foo", "bar")],
      of: fn(project: web.Project) -> Json {
        json.object([
          #("projectid", json.string(project.projectid)),
          #("name", json.string(project.name)),
          #("description", json.string(project.description)),
        ])
      },
    )
    |> json.to_string_builder,
  ))
}
