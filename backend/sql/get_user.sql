-- Parameters:
-- ?1 - The userid of the user

SELECT userid, password_hash
FROM users
WHERE userid = ?1;