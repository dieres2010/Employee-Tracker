const inquirer = require("inquirer");
const fs = require("fs");
const express = require('express');
const db = require('./db/connection');
const cTable = require('console.table');
const { Console } = require("console");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Use apiRoutes
//app.use('/api', apiRoutes);


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

  // Start server after DB connection
db.connect(err => {
  if (err) throw err;
  console.log('Database connected.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

// Display all Departments in the DataBase Departments Table

const showDep = () => {
    
    let sql = `SELECT * FROM department`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
};

// Display all Departments in the DataBase Departments Table

const showRole = () => {
    let sql = `SELECT title, role.id, department_id, department.name, salary FROM role LEFT OUTER JOIN department ON role.department_id = department.id`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
};

// Display all Departments in the DataBase Departments Table

const showEmpl = () => {
    let sql = `SELECT e.id, first_name, last_name, role_id AS role, r.title, r.salary, d.name AS department, manager_id FROM employee AS e LEFT JOIN role AS r  ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id;`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
};

// Add Department
const addDep = (nameDep) => {
    let sql = `INSERT INTO department (name) VALUES ("`+ nameDep+`")`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
  };

// Add Role
const addRole = (rolename, rolesalary, roledept) => {
    let sql = `INSERT INTO role (title, salary, department_id) VALUES ("`+rolename+`",` +rolesalary+`,"`+ roledept+`")`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
  };

// Add Employee
const addEmpl = (firstname, lastname, role, manager) => {
    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("`+firstname+`","` +lastname+`","`+ role+`","`+ manager+`")`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
  };

const UpdRole = (employeeid, newrole) => {
    let sql = `UPDATE employee SET role_id = "`+newrole+`" WHERE id = "`+employeeid+`"`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
    });
  };

function enterDep() {
    console.clear();
    inquirer.prompt([
        {
            message: "Enter the Department Name:",
            name: "depname"
        }
    ])
    .then(function({depname}) {
        addDep(depname);
    })
    
};

function enterRole() {
    console.clear();
    inquirer.prompt([
        {
            message: "Enter the Role Name:",
            name: "rolename"
        },
        {
            message: "Enter the Role Salary:",
            name: "rolesalary"
        },
        {
            message: "Enter the role Department:",
            name: "roledept"
        }
    ])
    .then(function({rolename, rolesalary, roledept}) {
        addRole(rolename, rolesalary, roledept);
    })
    
};
function enterEmpl() {
    console.clear();
    inquirer.prompt([
        {
            message: "Enter the Employee First Name:",
            name: "firstname"
        },
        {
            message: "Enter the Employee Last Name:",
            name: "lastname"
        },
        {
            message: "Enter the Employee's Role:",
            name: "role"
        },
        {
            message: "Enter the employee's Manager:",
            name: "manager"
        }
    ])    .then(function({firstname, lastname, role, manager}) {
        addEmpl(firstname, lastname, role, manager);
    })
    
};

function updEmplRole() {
    console.clear();
    inquirer.prompt([
        {
            message: "Enter the Employee's Id:",
            name: "employeeid"
        },
        {
            message: "Enter the New Role (id) for the Employee:",
            name: "newrole"
        }
    ])    .then(function({employeeid, newrole}) {
        UpdRole(employeeid, newrole);
    })
    
};

// Prompt members information
function trackEmpl() {
    console.clear();
    inquirer.prompt([{
        type: "list",
        message: "Choose an Option:",
        choices: [
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "Add a Department",
            "Add A Role",
            "Add an Employee",
            "Update an Employee Role",
            "Exit"
        ],
        name: "trackopt"
    },

    ])
    .then(function({trackopt}) {
        console.clear();
        switch (trackopt) {
            case "View All Departments":
                showDep(console.log('DEPARTMENTS'));
                break;
            case "View All Roles":
                showRole();
                break;
            case"View All Employees":
                showEmpl();
                break;
            case "Add a Department":
                enterDep();
                break;
            case "Add A Role":
                enterRole();
                break;
            case "Add an Employee":
                enterEmpl();
                break;
            case "Update an Employee Role":
                updEmplRole();
                break;
            default:
                db.end;
                process.exit(0);

        }
        trackEmpl();
    });
}


// Start the App
function initApp() {

    trackEmpl();
}

initApp();


