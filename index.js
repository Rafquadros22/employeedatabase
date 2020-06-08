

const inquirer = require("inquirer");

const mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  database: "dep_db",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("\n" + "connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer
    .prompt({
      name: "viewChoices",
      type: "list",
      message: "What would you like to view?",
      choices: [
        "department",
        "roles",
        "employees",
        "addDepartment",
        "addRoles",
        "addEmployee",
        "updateEmployeeRole",
        "EXIT",
      ],
    })
    .then(function (answer) {
      switch (answer.viewChoices) {
        case "department":
          readDep();
          break;
        case "roles":
          readRoles();
          break;
        case "employees":
          readEmpl();
          break;
        case "addDepartment":
          addDepartment();
          break;
        case "addRoles":
          addRole();
          break;
        case "addEmployee":
          addEmployee();
          break;
          case "updateEmployeeRole":
            updateEmployee();
            break;
        default:
          connection.end();
          "exit";
      }
    });
}






function addDepartment() {
  inquirer
    .prompt([
      {
        name: "depName",
        type: "input",
        message: "What would you like your name to be?",
        validate: function (value) {
          if (isNaN(value) !== false) {
            return true;
          }
          return false;
        },
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.depName,
        },

        function (err) {
          if (err) throw err;
          console.log("name inserted");
          // re-prompt the u
          start();
        }
      );
    });
}

function addRole() {
  connection.query ("select * from department", async function(err, results) {
      const departments = results.map ( (result) => ({
          name:result.name, 
          value:result.id
      }) )
      const roleInfo = await inquirer.prompt([
          {
              name: "title",
              message: "What is the title for the position"
          },
          {
              name: "salary",
              message: "What is the salary for the position"
          },
          {
              type: "list",
              name: "department_id",
              message: "Which Department does the role belong to?",
              choices:departments 
          }
      ])
      connection.query (`insert into role (title, salary, dep_id) values('${roleInfo.title}','${roleInfo.salary}','${roleInfo.department_id}' )`, printResults)
  })
}
function addEmployee() {
  connection.query ("select * from role", async function(err, results) {
      const roles = results.map ( (result) => ({
          name:result.title, 
          value:result.id
      }) )
      const employeeInfo = await inquirer.prompt([
          {
              name: "first_name",
              message: "What is the first name of the employee"
          },
          {
              name: "last_name",
              message: "What is the last name of the employee"
          },
          {
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices:roles 
          }
      ])
      connection.query (`insert into employee (first_name, last_name, role_id) values('${employeeInfo.first_name}','${employeeInfo.last_name}','${employeeInfo.role_id}' )`, printResults)
  })
}
function printResults(err){
if(err) throw(err)
console.log("ok")
}

function readDep() {
  console.log("Selecting from table...\n");
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(res);
    start();
  });
}

function readRoles() {
  console.log("Selecting from table...\n");
  connection.query(
    `select title, salary, name from role 
  inner join department on role.dep_id=department.id;`,
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      start();
    }
  );
}

function readEmpl() {
  console.log("Selecting from table...\n");
  connection.query(
    `select first_name, last_name, title, salary, name from employee
  inner join role on employee.role_id = role.id
  inner join department on role.dep_id= department.id;
  `,
    function (err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.log(res);
      start();
    }
  );
}




function updateEmployee() {

  connection.query("select * from employee", function (err, employees) {

      connection.query ("select * from role", async function(err, roles) {

          const roleChoices = roles.map ( (role) => ({
              name:role.title, 
              value:role.id
          }) )

          const employeeChoices = employees.map ( (employee) => ({
              name:employee.first_name + " " + employee.last_name, 
              value:employee.id
          }) )

          const updateEmployee = await inquirer.prompt([
              {
                  type: "list",
                  name: "employee_id",
                  message: "Which employee would you like to udate?",
                  choices:employeeChoices 
              },
              {
                  type: "list",
                  name: "role_id",
                  message: "What would you like their new role to be?",
                  choices:roleChoices 
              }
          ])

          connection.query (`update employee set role_id=${updateEmployee.role_id} where id=${updateEmployee.employee_id}`, printResults)

      })

  })

}

