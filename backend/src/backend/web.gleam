/// Middleware functions to work with requests and responses
import sqlight

pub type Context {
  Context(db: Connection, static_directory: String)
}

pub type Connection {
  Connection(inner: sqlight.Connection)
}

pub type User {
  User(userid: String, password: String)
}

pub type Project {
  Project(projectid: String, description: String)
}

pub type UserProject {
  UserProject(userid: String, projectid: String)
}

pub type HardwareSet {
  HardwareSet(projectid: String, name: String, capacity: Int, available: Int)
}
