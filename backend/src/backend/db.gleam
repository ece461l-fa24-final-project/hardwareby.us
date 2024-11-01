import simplifile
import sqlight
import wisp

pub opaque type Connection {
  Connection(inner: sqlight.Connection)
}

pub fn connect(database: String) -> Connection {
  let assert Ok(priv_directory) = wisp.priv_directory("backend")
  let assert Ok(schema) = simplifile.read(priv_directory <> "/schema.sql")
  let assert Ok(db) = sqlight.open(database)
  let assert Ok(_) = sqlight.exec(schema, db)
  Connection(db)
}
