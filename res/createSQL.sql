create database aidanchat;
	use aidanchat;

drop table user;
drop table message;
drop table relation;
drop table friendRequest;
create table user(
	name varchar(30) primary key unique,
	password varchar(30),
	email varchar(30) unique,
	gender varchar(7)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table message(
    fromuser varchar(30),
    touser varchar(30),
	content text,
    dayandtime datetime
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table relation(
    user varchar(30),
    friend varchar(30),
	state varchar(30)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table friendRequest(
    fromname varchar(30),
    toname varchar(30),
    reason varchar(50)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
