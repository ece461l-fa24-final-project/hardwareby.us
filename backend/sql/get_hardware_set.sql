-- Used for GET hardware/id as well checkin/checkout for sanity checking purposes.
-- Parameters:
-- ?1 - The id of the Hardware Set to get.

SELECT *
FROM hardware_sets
WHERE id = ?1;