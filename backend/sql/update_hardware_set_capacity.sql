-- Parameters:
-- ?1 - The id of the Hardware Set to update.
-- ?2 - The new capacity of the set.

UPDATE hardware_sets
SET capacity = ?2
WHERE id = ?1;