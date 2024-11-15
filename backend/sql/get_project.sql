-- Parameters
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
GROUP BY p.projectid, p.name, p.description, p.created_at, p.last_updated;