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

pub fn create_hardware_set(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The projectid of the project this set belongs to.
-- ?2 - The name of the hardware set.
-- ?3 - The max capacity of the hardware set.

INSERT INTO hardware_sets (projectid, name, capacity, available)
VALUES (?1, ?2, ?3, ?3)"
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

pub fn get_hardware_set(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Used for GET hardware/id as well checkin/checkout for sanity checking purposes.
-- Parameters:
-- ?1 - The id of the Hardware Set to get.

SELECT *
FROM hardware_sets
WHERE id = ?1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_hardware_sets(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The projectid of the project to grab associated sets of.

SELECT hs.id, hs.projectid, hs.name, hs.capacity, hs.available
FROM hardware_sets hs
INNER JOIN projects p ON hs.projectid = p.projectid
WHERE hs.projectid = ?1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_last_rowid(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Used right after create_hardware_set.sql. Not sure why we can't batch queries with SQLight out of the box...

SELECT last_insert_rowid();"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_project(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters
-- ?1 - The projectid to query
-- ?2 - The user who is requesting the information

SELECT 
    p.projectid,
    p.name,
    p.description,
    GROUP_CONCAT(h.id) as hardware_set_ids
FROM projects p
INNER JOIN user_projects up ON p.projectid = up.projectid
LEFT JOIN hardware_sets h ON p.projectid = h.projectid
WHERE p.projectid = ?1 
AND up.userid = ?2
GROUP BY p.projectid, p.name, p.description, p.created_at, p.last_updated;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_projects(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters
-- ?1 - The userid of the user to get projects for

SELECT p.projectid, p.name, p.description
FROM projects p
INNER JOIN user_projects up on p.projectid = up.projectid
WHERE up.userid = ?1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}

pub fn get_user(
  db: sqlight.Connection,
  arguments: List(sqlight.Value),
  decoder: dynamic.Decoder(a),
) -> QueryResult(a) {
  let query =
    "-- Parameters:
-- ?1 - The userid of the user

SELECT userid, password_hash
FROM users
WHERE userid = ?1;"
  sqlight.query(query, db, arguments, decoder)
  |> result.map_error(error.DatabaseError)
}
