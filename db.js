const { Pool } = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'banana',
    host: 'localhost',
    database: 'employee_db'
});

pool.connect();

module.exports = pool