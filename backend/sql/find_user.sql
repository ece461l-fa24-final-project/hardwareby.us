SELECT password_hash 
FROM users 
WHERE userid = :userid 
LIMIT 1;