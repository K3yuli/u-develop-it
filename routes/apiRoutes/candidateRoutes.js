const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// GET all candidates - wrapped in an Express.js route
router.get('/candidates', (req, res) => {
    // JOIN syntax
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id`;

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

// Get a single candidate in an Express.js route
// the endpoint has a route parameter that will hold the value of the id to specify which candidate we'll select from the database.
router.get('/candidate/:id', (req, res) => {
    // JOIN syntax
    const sql = `SELECT candidates.*, parties.name
    AS party_name
    FROM candidates
    LEFT JOIN parties
    ON candidates.party_id = parties.id
    WHERE candidates.id = ?`;
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

// create a candidate with Express.js
router.post('/candidate', ({ body }, res) => {
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
    const params = [body.first_name, body.last_name, body.industry_connected];

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

// update a candidate's party
router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');
    if(errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `UPDATE candidates SET party_id = ?
    WHERE id = ?`;

    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if(err) {
            res.status(400).json({ error: err.message });
            // check if a record was found
        } else if(!result.affectedRows) {
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json({
                message: 'success',
                data: req.body,
                changes: result.affectedRows
            });
        }
    });
});

// create route that will delete a candidate from database
router.delete('/candidate/:id', (req, res) => {
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

module.exports = router;