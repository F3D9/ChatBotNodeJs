Create Table users(
    id serial PRIMARY KEY,
    username Varchar(50) unique not NULL,
    email Varchar(50) unique not Null,
    password Varchar(5000) not NULL
);
