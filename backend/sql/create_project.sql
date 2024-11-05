-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The description of the project.
-- ?3 - The userid of the user creating the project.

INSERT INTO projects (projectid, description)
VALUES (?1, ?2);

INSERT INTO user_projects (userid, projectid)
VALUES (?3, ?1);