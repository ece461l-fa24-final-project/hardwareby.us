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

create table if not exists projects (
    id integer primary key autoincrement,
    projectid text not null unique,
    name text,
    description text,
    created_at text not null default CURRENT_TIMESTAMP,
    last_updated text
) strict;

-- Index for faster project lookups during gets and user connections
create index if not exists idx_projects_projectid on projects(projectid);

-- Bridge table between projects and their users
create table if not exists user_projects (
    userid text not null,
    projectid text not null,
    foreign key (userid) references users(userid)
    foreign key (projectid) references projects(projectid)
    primary key (userid, projectid)
) strict;

create table if not exists hardware_sets (
    id integer primary key autoincrement,
    projectid text not null,
    name text not null,
    capacity integer not null,
    available integer not null,
    created_at text not null default CURRENT_TIMESTAMP,
    last_updated text,
    foreign key (projectid) references projects(projectid)
) strict;