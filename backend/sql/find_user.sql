SELECT password_hash 
FROM users 
WHERE userid = $1
LIMIT 1;