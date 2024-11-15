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
  Project(projectid: String, name: String, description: String)
}

pub type DetailedProject {
  DetailedProject(
    id: String,
    name: String,
    description: String,
    hardware: List(Int),
  )
}

pub type HardwareSet {
  HardwareSet(
    id: Int,
    projectid: String,
    name: String,
    capacity: Int,
    available: Int,
  )
}
