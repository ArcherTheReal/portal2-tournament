CREATE TABLE users (
    id integer primary key,
    steamid integer not null unique, 
    admin integer default 0 check (admin in (0,1))
);