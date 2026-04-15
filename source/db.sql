Create Table users(
    id serial PRIMARY KEY,
    username Varchar(50) unique not NULL,
    email Varchar(50) unique not Null,
    password Varchar(5000) not NULL
);

Create Table conversations(
    id_conversations serial PRIMARY KEY,
    id_user INT not Null references users(id),
    title Varchar(150) not Null,
);

CREATE Table messages(
    id_message serial PRIMARY KEY,
    id_conversations int not Null references conversations(id_conversations),
    content text not Null,
    writer Varchar(50) not Null,
    time_send TIMESTAMP not Null default now(),
)