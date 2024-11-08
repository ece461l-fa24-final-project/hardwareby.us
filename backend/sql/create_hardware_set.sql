-- Parameters:
-- ?1 - The projectid of the project this set belongs to.
-- ?2 - The name of the hardware set.
-- ?3 - The max capacity of the hardware set.

INSERT INTO hardware_sets (projectid, name, capacity, available)
VALUES (?1, ?2, ?3, ?3)