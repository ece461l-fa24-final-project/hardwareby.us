pragma foreign_keys = on;
pragma journal_mode = wal;

create table if not exists users (
    id integer primary key autoincrement,
    userid text not null unique,
    password_hash text not null,
    created_at text not null default CURRENT_TIMESTAMP,
    last_login text
) strict;

-- Index for faster userid lookups during authentication
create index if not exists idx_users_userid on users(userid);
