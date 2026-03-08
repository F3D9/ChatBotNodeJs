Create Table Users(
    Id serial PRIMARY KEY,
    Username Varchar(50) unique not NULL,
    Email Varchar(50) unique not Null,
    Password Varchar(5000) not NULL
);
