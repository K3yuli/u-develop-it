// connect mysql database. import mysql2
const mysql = require('mysql2');

// import express
const express = require('express');

// add port designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();

// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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




// return all the date in the candidates table
db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});

// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

