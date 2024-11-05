-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The userid of the user adding themselves to the project.

INSERT INTO projects (projectid)
VALUES (?1);

INSERT INTO user_projects (userid, projectid)
VALUES (?2, ?1);