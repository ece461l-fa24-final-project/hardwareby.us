BEGIN TRANSACTION;

-- Attempt to insert the new user
INSERT INTO users (userid, password_hash)
VALUES 
    (?, ?)
ON CONFLICT(userid) DO
    -- If userid exists, roll back the entire transaction
    ROLLBACK;

-- If we get here, the insert succeeded
COMMIT;