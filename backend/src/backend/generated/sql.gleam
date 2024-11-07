// THIS FILE IS GENERATED. DO NOT EDIT.
// Regenerate with `gleam run -m codegen`

import backend/error.{type Error}
import gleam/dynamic
import gleam/result
import sqlight

pub type QueryResult(t) =
  Result(List(t), Error)

pub fn add_user_to_project(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The userid of the user

INSERT INTO user_projects (userid, projectid)
VALUES (?2, ?1);"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn check_user(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The user's login ID
-- ?2 - The password to check
-- Note: The password should be hashed using the same algorithm used to create password_hash
-- before being used in this query

select 
    password_hash = ?2
from users 
where userid = ?1
limit 1;

-- If authentication succeeds, update last_login timestamp
update users 
set last_login = CURRENT_TIMESTAMP
where userid = ?1
and exists (
    select 1 
    from users 
    where userid = ?1
    and password_hash = ?2
);"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn create_project(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The display name of the project
-- ?3 - The description of the project.

INSERT INTO projects (projectid, name, description)
VALUES (?1, ?2, ?3);"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn create_user(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "INSERT INTO users (userid, password_hash)
VALUES (?, ?)"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_projects(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "SELECT p.projectid, p.name, p.description
FROM projects p
INNER JOIN user_projects up on p.projectid = up.projectid
WHERE up.userid = ?1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}
