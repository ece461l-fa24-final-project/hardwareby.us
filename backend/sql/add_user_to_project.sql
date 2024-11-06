-- Parameters:
-- ?1 - The projectid of the project
-- ?2 - The userid of the user

INSERT INTO user_projects (userid, projectid)
VALUES (?2, ?1);