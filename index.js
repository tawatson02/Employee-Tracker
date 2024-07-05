const inquirer = require('inquirer');
const db = require('./db');
const { validateHeaderName } = require('http');

const mainMenu = () => {
    inquirer.prompt({
        name: 'menuOption',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    }).then(answer => {
        switch (answer.menuOption) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            default:
                db.end();
                process.exit();
        }
    });
}; 

const viewAllDepartments = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewAllRoles = () => {
    const query = `SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const viewAllEmployees = () => {
    const query = `SELECT employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments on roles.department_id = departments.id
    LEFT JOIN employees manager ON manager.id = employee.manager_id`;
    db.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        mainMenu();
    });
};

const addDepartment = () => {
    inquirer.prompt({
        name: 'name',
        type: 'input',
        message: 'Enter the name of the department:'
    }).then(answer => {
        db.query('INSERT INTO departments (name) VALUES ($1)', [answer.name], (err, res) => {
            if (err) throw err;
            console.log('Department added!');
            mainMenu();
        });
    });
};

const addRole = () => {
    db.query('SELECT * FROM departments', (err, res) =>{
        if (err) throw err;
        const departments = res.rows.map(department => ({
            name: department.name,
            value: department.id
        }));
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Enter the title of the role:'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Enter the salary for the role:'
            },
            {
                name: 'department_id',
                type: 'list',
                message: 'Select the department:',
                choices: departments
            }
        ]).then(answers => {
            db.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)',
               [answers.title, answers.salary, answers.department_id], (err, res) => {
                if (err) throw err;
                console.log('Role added!');
                mainMenu();
               });
        });
    });
};

const addEmployee = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        const roles = res.rows.map(role => ({
            name: role.title,
            value: role.id
        }));

        db.query('SELECT * FROM employees', (err, res) => {
            if (err) throw err;
            const managers = res.rows.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));
            managers.push({name: 'None', value: null});

            inquirer.prompt([
                {
                    name: 'first_name',
                    type: 'input',
                    message: 'Enter the first name of the employee:'
                },
                {
                    name: 'last_name',
                    type: 'input',
                    message: 'Enter the last name of the employee:',
                },
                {
                    name: 'role_id',
                    type: 'list',
                    message: 'Select the role of the employee:',
                    choices: roles
                },
                {
                    name: 'manager_id',
                    type: 'list',
                    message: 'Select the manager for the employee:',
                    choices: managers
                }
            ]).then(answers => {
                db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
                [answers.first_name, answers.last_name, answers.role_id, answers.manager_id], (err, res) => {
                    if (err)throw err;
                    console.log('Employee added!');
                    mainMenu();
                });
            });
        });
    });
};

const updateEmployeeRole = () =>  {
    db.query('SELECT * FROM  employees', (err,res) => {
        if (err) throw err;
        const employees = res.rows.map(employee => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee_id
        }));
        db.query('SELECT * FROM roles', (err, res) => {
            if (err) throw err;
            const roles = res.rows.map(role => ({
                name: role.title,
                value: role.id
            }));
            inquirer.prompt([
                {
                name: 'employee_id',
                type: 'list',
                message: 'Select the employee to update:',
                choices: employees
                },
                {
                name: 'role_id',
                type: 'list',
                message: 'Select the new role:',
                choices: roles
                }
            ]).then(answers => {
                db.query('UPDATE employees SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id], (err, res) => {
                    if (err) throw err;
                    console.log('Employee role updated!');
                    mainMenu();
                });
            });
        });
    });
};

mainMenu();