import backend
import backend/db
import backend/router
import gleeunit
import gleeunit/should
import wisp/testing

pub fn main() {
  gleeunit.main()
}

fn with_database(f: fn(db.Connection) -> t) -> t {
  let db = db.connect(":memory:")
  let t = f(db)
  t
}

fn with_context(testcase: fn(fn() -> router.Context) -> t) -> t {
  use db <- with_database()
  // Create context to use in tests
  let context = fn() {
    router.Context(db, static_directory: backend.static_directory())
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