create table user(
	name varchar(30) primary key unique,
	password varchar(30),
	email varchar(30) unique,
	gender varchar(7)
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table message(
    fromuser varchar(30),
    touser varchar(30),
	content varchar(200),
    dayandtime datetime,
    state boolean
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table relation(
    user varchar(30),
    friend varchar(30),
	state varchar(30),
	)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table friendRequest(
    fromname varchar(30),
    toname varchar(30),
    reason varchar(50)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

select * from user where name='222222' and name not in(
	select friend from relation where user='111111'); 

insert into relation values('111111','333333','1');
insert into relation values('333333','111111','1');


insert into user values('333333','333333','3vdfvd32@dwd.xom','male');

insert into message values('whosyourdaddy',
	'111','222','2010-2-3 13:12:23');

insert into message values('whosyourdaddy',
	'111','222','2010-2-3 13:12:24');