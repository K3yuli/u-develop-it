
// connect mysql database. import mysql2
const mysql = require('mysql2');


// connects application to the mysql database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // your MySQL username,
        user: 'root',
        // Your MySQL password
        password: '69Sql552',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

module.exports = db;