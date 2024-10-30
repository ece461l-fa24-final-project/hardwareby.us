import backend
import backend/router
import backend/web.{type Context, Context}
import gleeunit
import gleeunit/should
import wisp/testing

pub fn main() {
  gleeunit.main()
}

fn with_context(testcase: fn(Context) -> t) -> t {
  // Create context to use in tests
  let context = Context(static_directory: backend.static_directory())

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
