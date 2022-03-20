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

// Display all Departments

const showDep = () => {
    
    let sql = `SELECT * FROM department`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Display all Roles

const showRole = () => {
    let sql = `SELECT title, role.id, department_id, department.name, salary FROM role LEFT OUTER JOIN department ON role.department_id = department.id`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Display all Employees

const showEmpl = () => {
    let sql = `SELECT e.id, first_name, last_name, role_id AS role, r.title, r.salary, d.name AS department, manager_id FROM employee AS e LEFT JOIN role AS r  ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id;`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Add Department

const addDep = (nameDep) => {
    let sql = `INSERT INTO department (name) VALUES ("`+ nameDep+`")`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log("Department: ", nameDep, "Created" )
      console.log(" ");
      trackEmpl();
    });
  };

// Add Role

const addRole = (rolename, rolesalary, roledept) => {
    let sql = `INSERT INTO role (title, salary, department_id) VALUES ("`+rolename+`",` +rolesalary+`,"`+ roledept+`")`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log("Role: ", rolename, " with Salary: ", rolesalary, " and Department: ", roledept, "Created" )
      console.log(" ");
      trackEmpl();
    });
  };

// Add Employee

const addEmpl = (firstname, lastname, role, manager) => {
    
    let sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("`+firstname+`","` +lastname+`","`+ role+`","`+ manager+`")`;
    
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log("Employee: ", firstname, " ", lastname," with role: ", role, " and Manager: ", manager, "Created" );
      console.log(" ");
      trackEmpl();
    });
  };


// Update Employee Role

const UpdRole = (employeeid, newrole) => {
    let sql = `UPDATE employee SET role_id = "`+newrole+`" WHERE id = "`+employeeid+`"`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log("Employee id: ", employeeid, " now have Role id: ", newrole );
      console.log(" ");
      trackEmpl();
    });
  };

  // Update Employee Manager

  const UpdMgr = (employeeid, newmgr) => {
    let sql = `UPDATE employee SET manager_id = "`+newmgr+`" WHERE id = "`+employeeid+`"`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log("Employee id: ", employeeid, " now have Manager id: ", newmgr );
      console.log(" ");
      trackEmpl();
    });
  };

  //Delete a record from Department or Role or Employee depending on option chosen

  const delRec = (option, optid) => {

    let sql = `DELETE FROM `+option+` WHERE id = "`+optid+`"`;
      
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.log(" ");
      console.log(option," id: ", optid, " deleted");
      console.log(" ");
      trackEmpl();
    });
  };


// Display all Employees Ordered by Department

const showEmplDep = () => {
    let sql = `SELECT d.id AS Departmen_id, d.name AS Department_name, e.id AS Employee, first_name, last_name, role_id AS role, r.title, r.salary, manager_id FROM employee AS e LEFT JOIN role AS r  ON e.role_id = r.id LEFT JOIN department AS d ON r.department_id = d.id ORDER BY d.id ASC;`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Display utilized budget by Department

const showBudget = () => {
    let sql = `SELECT d.id AS Departmen_id, d.name AS Department_name, SUM(r.salary) AS budget FROM employee AS e LEFT JOIN role as r ON e.role_id = r.id LEFT JOIN department AS d  ON r.department_id = d.id  WHERE e.role_id IS NOT NULL GROUP BY 1, 2 ORDER BY 3 DESC;`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Display all Employees Ordered by Manager

const showEmplMgr = () => {
    let sql = `SELECT manager_id AS Manager, id AS Employee, first_name, last_name, role_id AS role FROM employee ORDER BY manager_id ASC;`;
  
    db.query(sql, (err, res) => {
      if (err) throw err;
      console.table("");
      console.table(res);
      trackEmpl();
    });
};

// Enter New Department

function enterDep() {
    console.table(" ");
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

// Enter New Role

function enterRole() {
    console.table(" ");
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

// Enter New Employee

function enterEmpl() {
    console.table(" ");
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

// Enter Employee New Role

function updEmplRole() {
    console.table(" ");
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

// Enter Employee New Manager

function updEmplMgr() {
    console.table(" ");
    inquirer.prompt([
        {
            message: "Enter the Employee's Id:",
            name: "employeeid"
        },
        {
            message: "Enter the New Manager (id) for the Employee:",
            name: "newmgr"
        }
    ])    .then(function({employeeid, newmgr}) {
        UpdMgr(employeeid, newmgr);
    })
    
};

// Prompt for Delete Options

function delRecord() {

    inquirer.prompt([{
            type: "list",
            message: "Choose an Option:",
            choices: [
                "department",
                "role",
                "employee"
            ],
            name: "delopt"
        },
        {
            message: "Enter the id (Department/Role/Employee) to Delete: ",
            name: "delid"
        }
    ])  .then(function({delopt, delid}) {

            delRec (delopt,delid);
        })
    
    };
        

// Prompt for Information

function trackEmpl() {
//    console.clear();
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
            "Update Employee Manager",
            "View Employees by Manager",
            "View Employees by Department",
            "Delete Role/Employee/Department",
            "View Utilized Budget of a Department",
            "Exit"
        ],
        name: "trackopt"
    },

    ])
    .then(function({trackopt}) {
       // console.clear();
        switch (trackopt) {
            case "View All Departments":
                showDep(console.log('DEPARTMENTS'));
                break;
            case "View All Roles":
                showRole(console.log('ROLES'));
                break;
            case"View All Employees":
                showEmpl(console.log('EMPLOYEES'));
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
            case  "Update Employee Manager":
                updEmplMgr();
                break;
            case "View Employees by Manager":
                showEmplMgr(console.log('EMPLOYEES BY MANAGER'));
                break;
            case "View Employees by Department":
                showEmplDep(console.log('EMPLOYEES BY DEPARTMENT'));
                break;
            case "Delete Role/Employee/Department":
                delRecord();
                break;
            case "View Utilized Budget of a Department":
                showBudget(console.log('BUDGET BY DEPARTMENT'));
                break;
            default:
                db.end;
                process.exit(0);

        }
    });
}

// Start the App
function initApp() {

    trackEmpl();
}

initApp();


