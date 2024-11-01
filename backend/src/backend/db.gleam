import simplifile
import sqlight

pub opaque type Connection {
  Connection(inner: sqlight.Connection)
}

pub fn connect(database: String) -> Connection {
  let assert Ok(schema) = simplifile.read("schema.sql")
  let assert Ok(db) = sqlight.open(database)
  let assert Ok(_) = sqlight.exec(schema, db)
  Connection(db)
}
