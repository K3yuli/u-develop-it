// import express
const express = require('express');
// import connection
const db = require('./db/connection');
// connects to apiRoutes file
const apiRoutes = require('./routes/apiRoutes');


// add port designation and the app expression
const PORT = process.env.PORT || 3001;
const app = express();


// express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// use apiRoutes 
app.use('/api', apiRoutes);


// -----------------------------------------------
// return all the date in the candidates table
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// delete a candidate using query
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(result);
// });

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

// -----------------------------------------------

// default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


// function that will start the server on port 3001 after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });

