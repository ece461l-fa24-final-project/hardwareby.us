// THIS FILE IS GENERATED. DO NOT EDIT.
// Regenerate with `gleam run -m codegen`

import backend/error.{type Error}
import gleam/dynamic
import gleam/result
import sqlight

pub type QueryResult(t) =
  Result(List(t), Error)

pub fn create_user(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "BEGIN TRANSACTION;

-- Attempt to insert the new user
INSERT INTO users (userid, password_hash)
VALUES 
    (?, ?)
ON CONFLICT(userid) DO
    -- If userid exists, roll back the entire transaction
    ROLLBACK;

-- If we get here, the insert succeeded
COMMIT;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn find_user(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "SELECT password_hash 
FROM users 
WHERE userid = $1
LIMIT 1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}
