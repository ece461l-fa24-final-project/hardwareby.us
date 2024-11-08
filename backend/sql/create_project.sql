-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The display name of the project
-- ?3 - The description of the project.

INSERT INTO projects (projectid, name, description)
VALUES (?1, ?2, ?3);