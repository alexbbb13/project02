
create table users (
	id serial primary key,
	username varchar(200) not null,
	login varchar (100) unique not null,
	password_hashed varchar(100),
	timestamp timestamp not null
);

create table photos (
	id serial primary key,
	filename varchar (100)
);

create table comments (
	id serial primary key,
	user_id integer not null references users(id),
	photo_id integer not null references photos(id),
	text varchar (200)
);

create table photo_users (
	id serial primary key,
	user_id integer references users(id),
	photo_id integer references photos(id)
);

create table subscriptions (
	id serial primary key,
	user_id integer references users(id),
	subscribed_to integer references users(id)
);


insert into users (username, login, password_hashed, timestamp) 
	VALUES ('Alex Big', 'alex', '123456', CURRENT_TIMESTAMP),
	('Maria Small', 'maria', '123456', CURRENT_TIMESTAMP);

insert into photos (filename) 
	VALUES ('Photo001.jpg'),
	('Photo002.jpg'),
	('Photo003.jpg'),
	('Photo004.jpg');

insert into photo_users (user_id, photo_id) 
	VALUES (1, 1),
	(1, 2),
	(2, 3),
	(2, 4);

insert into comments (user_id, photo_id, text) 
	VALUES (1,1,'My first Photo'),
	(1,2,'My second Photo #issocool'),
	(2,2,'Your second Photo #issocool'),
	(1,3,'Your first Photo #issocool, it rocks!');


