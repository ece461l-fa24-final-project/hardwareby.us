-- Parameters:
-- ?1 - The id of the Hardware Set to update.
-- ?2 - The new availability of the set.

UPDATE hardware_sets
SET available = ?2
WHERE id = ?1;