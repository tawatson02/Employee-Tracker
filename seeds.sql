INSERT INTO department (name)
VALUES ('Engineering'),
('Sales'),
('Finance'),
('Human Resources');

INSERT INTO role(title, salary, department_id)
VALUES ('Software Engineer', 70000, 1),
('Senior Software Engineer', 90000, 1),
('Sales Representative', 50000, 2),
('Sales Manager', 75000, 2),
('Accountant', 60000, 3),
('Finance Manager', 85000, 3),
('HR Specialist', 55000, 4),
('HR Manager', 80000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mary', 'Johnson', 3, NULL),
('James', 'Brown', 4, 3),
('Patricia', 'Jones', 5, NULL),
('Robert', 'Garcia', 6, 5),
('Linda', 'Martinez', 7, NULL),
('Michael', 'Wilson', 8, 7),
('William', 'Anderson', 1, 1),
('Elizabeth', 'Taylor', 2, 1),
('David', 'Thomas', 3, 3),
('Barbara', 'Moore', 4, 3),
('Richard', 'Jackson', 5, 5),
('Susan', 'White', 6, 5),
('Joseph', 'Harris', 7, 7),
('Sarah', 'Martin', 8, 7);