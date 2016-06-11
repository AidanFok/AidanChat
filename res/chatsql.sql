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

select * from user where name='222222' and name not in(
	select friend from relation where user='111111'); 

insert into user values('111111','111111','3vdd32@dwd.xom','male');
insert into user values('222222','222222','3vd32@dwd.xom','male');
insert into user values('333333','333333','3vdfvd3@dwd.xom','male');
insert into user values('444444','444444','3vdvd3@dwd.xom','male');

insert into relation values('111111','333333','亲戚');
insert into relation values('333333','111111','1');
insert into relation values('111111','222222','同学');
insert into relation values('222222','111111','1');
insert into relation values('111111','444444','亲戚');
insert into relation values('444444','111111','1');


insert into message values('whosyourdaddy',
	'111','222','2010-2-3 13:12:23');

insert into message values('whosyourdaddy',
	'111','222','2010-2-3 13:12:24');