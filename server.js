// import express
const express = require('express');

// connect mysql database. import mysql2
const mysql = require('mysql2');

// import module for inputCheck
const inputCheck = require('./utils/inputCheck');


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

// -----------------------------------------------
// return all the date in the candidates table
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// GET all candidates - wrapped in an Express.js route
// This route is designated with the endpoint /api/candidates.
// the api in the URL signifies that this is an API endpoint.
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// API endpoint to Get a single candidate in an Express.js route
// the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates WHERE id = ?`;
    // In the database call, we'll assign the captured value populated in the req.params object with the key id to params.
    // The database call will then query the candidates table with this id and retrieve the row specified. Because params can be accepted in the database call as an array,
    // params is assigned as an array with a single element, req.params.id.
    const params = [req.params.id];
  
    db.query(sql, params, (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: 'success',
        data: row
      });
    });
  });

// delete a candidate using query
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// create API endpoint that will delete a candidate from database
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.statusMessage(400).json({ error: res.message });

        // if the user tries to delete a candidate that doesn't exist
        } else if(!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        // 
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});


// create a candidate with query
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?,?,?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

// create a candidate with Express.js
app.post('/api/candidate', ({ body }, res) => {
    // This inputCheck module was provided by a helpful U Develop It member.
    // We'll use this module to verify that user info in the request can create a candidate.
    // we must import the module first const inputCheck = require(<directory path>)
    const errors = inputCheck(
        body, 
        'first_name', 
        'last_name', 
        'industry_connected'
        );
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [body.firs_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});



// -----------------------------------------------

// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

