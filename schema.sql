drop database if exists dep_db;
create database dep_db;
use dep_db;

create table department(
id int auto_increment primary key,
name1 varchar(30)
);

 
create table role1(
id int auto_increment primary key,
title varchar(30) not null,
salary decimal(10,2) not null ,
dep_id int not null
);

create table employee(
id int auto_increment primary key,
first_name varchar (30) not null, 
last_name varchar(30) not null,
role_id int not null
);

insert into role1 (title,salary,dep_id)
values("rafael",999.99,1);
select * from role1;

select * from department;

select * from employee;