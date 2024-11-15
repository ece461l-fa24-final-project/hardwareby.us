import gleam/json
import simplifile
import sqlight

pub type Error {
  FileError(simplifile.FileError)
  DatabaseError(sqlight.Error)
  JsonDecodeError(json.DecodeError)
  NotFoundError(Nil)
}
