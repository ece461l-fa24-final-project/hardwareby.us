-- Parameters:
-- ?1 - The projectid of the project to grab associated sets of.

SELECT hs.id, hs.projectid, hs.name, hs.capacity, hs.available
FROM hardware_sets hs
INNER JOIN projects p ON hs.projectid = p.projectid
WHERE hs.projectid = ?1;