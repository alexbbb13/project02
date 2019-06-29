
create table user {
	id serial primary key,
	username varchar(200) not null,
	login varchar (100) unique not null,
	password_hashed varchar(100),
	timestamp timestamp not null
};

create table photo {
	id serial primary key,
	filename varchar (100)
};

create table comment {
	id serial primary key,
	user_id integer not null references user(id),
	photo_id integer not null references photo(id),
	text varchar (200)
};

create table photo_users {
	id serial primary key,
	user_id integer references user(id),
	photo_id integer references photo(id)
};

create table subscriptions {
	id serial primary key,
	user_id: integer references user(id),
	subscribed_to integer references user(id)
};


insert into user (username, login, password_hashed, timestamp) 
	VALUES ('Alex Burov', 'alex', '123456', CURRENT_TIMESTAMP),
	('Maria Burova', 'maria', '123456', CURRENT_TIMESTAMP);

insert into photo (filename) 
	VALUES ('Photo001.jpg'),
	('Photo002.jpg'),
	('Photo003.jpg'),
	('Photo004.jpg');

insert into photo_users (user_id, photo_id) 
	VALUES (SELECT id FROM user WHERE username='Alex Burov', 1),
	(SELECT id FROM user WHERE username='Alex Burov', 2),
	(SELECT id FROM user WHERE username='Maria Burova', 3),
	(SELECT id FROM user WHERE username='Maria Burova', 4);

insert into comment (user_id, photo_id, text) 
	VALUES (1,1,"My first Photo"),
	(1,2,"My second Photo #issocool"),
	(2,2,"Your second Photo #issocool"),
	(1,3,"Your first Photo #issocool, let's rock!");
