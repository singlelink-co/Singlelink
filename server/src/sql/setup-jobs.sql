------------
-- Jobs
------------

create schema if not exists jobs;

/*
 This allows the cluster to synchronize across multiple servers that share the same database.
 This way they only run tasks once instead of repeating the same task over and over again.
 */
create table if not exists jobs.locks
(
    id         bigserial primary key unique,
    name       text unique not null,
    created_on timestamp   not null default current_timestamp,
    expires    timestamp   not null default now() + interval '5 minutes'
);
