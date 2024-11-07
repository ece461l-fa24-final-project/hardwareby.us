-- Parameters
-- ?1 - The userid of the user to get projects for

SELECT p.projectid, p.name, p.description
FROM projects p
INNER JOIN user_projects up on p.projectid = up.projectid
WHERE up.userid = ?1;