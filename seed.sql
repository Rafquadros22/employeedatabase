

insert into department (name)
values("sales"),("engineering"),("finance"),("legal");
select * from department;

insert into role (title,salary,dep_id)
values("sales lead",100000,1),("accountant","200000",2),("cto",500000,2);
select * from role;

insert into employee (first_name,last_name,role_id)
values("chu","chu",1),("kobe","kobe",2),("dan","dan",3);
select * from employee;


select title ,salary,name from role;
inner join department on role.department_id=department.id;

select first_name, last_name, title, salary, name from employee;
inner join role on employee.role_id = role.id
inner join department on role.department_id= department.id;