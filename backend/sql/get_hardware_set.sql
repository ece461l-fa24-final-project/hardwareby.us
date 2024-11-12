-- This is used in checkin/checkout to verify that the operation is valid before updating the column.
-- I think this can technically be done in SQL, but I'm not sure how to return specifically an error if the query is invalid.
-- Parameters:
-- ?1 - The id of the Hardware Set to get.

SELECT *
FROM hardware_sets
WHERE id = ?1;