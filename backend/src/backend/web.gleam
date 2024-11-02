/// Middleware functions to work with requests and responses
import sqlight

pub type Context {
  Context(db: Connection, static_directory: String)
}

pub type User {
  User(userid: String, password: String)
}

pub type Connection {
  Connection(inner: sqlight.Connection)
}
