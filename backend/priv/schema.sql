pragma foreign_keys = on;
pragma journal_mode = wal;

create table if not exists users (
    id integer primary key autoincrement,
    userid text not null unique,
    password_hash text not null,
    created_at integer not null default CURRENT_TIMESTAMP,
    last_login integer
    -- constraint username_format check (
    --     userid REGEXP '^[a-zA-Z0-9_]{3,64}$'  -- Alphanumeric + underscore, 3-64 chars
    -- )
) strict;

-- Index for faster userid lookups during authentication
create index idx_users_usernid on users(userid);
