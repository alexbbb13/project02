var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/* GET home page. */

router.get('/:photoId', function(req, res, next) {
const id = req.params.photoId;
//const query = 'select username, text from comments left join users on users.id=comments.user_id where comments.photo_id=$1::int';
const query = 'select username, text, filename from comments left join users on users.id=comments.user_id left join photos on photos.id=comments.photo_id where comments.photo_id=$1::int';
const params = [id];
pool.query(query,params, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }

    const record=result.rows;
    if(record.length > 0) {
            const recordMapped = record.map(row => { 
                const rObj = {};
                rObj['username'] = row.username;
                rObj['text'] = row.text;
                return rObj;});  
            //res.json({comments: recordMapped });
            res.render('photo_comments', {comments: recordMapped, filename: record[0].filename, photoId: id });
        } else {
            res.render('error', {message: 'No data', error: {status : '', stack : ''}});
        }
    });    
});



router.post('/newuser', function(req, res, next) {
    const username = req.body.username;
    const login = req.body.login;
    const password = req.body.password;
    const paramsTest = [username, login];
    const queryTest = 'SELECT username,login FROM users where username=$1::text OR login=$2::text';
    pool.query(query,params, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        const record=result.rows;
        if(record.length == 0) {
            //Username or login not found
            //Encrypt password
            bcrypt.hash(password, 10, function(err, hash) {
                // Store hash in database
                const query = 'INSERT INTO users (username, login, password_hashed) VALUES ($1::text, $2::text, $3::text) RETURNING id';
                const params = [username, login, hash ];
                pool.query(query,params, function(err, result) {
                // If an error occurred...
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                }
                //Success !
                    const insertedId = result.id;
                    
                });
            });   
        } else {
            res.render('error', {message: 'User exists', error: {status : '', stack : ''}});
        }
    });

    const userId = 1; //@TODO get user id from session
    const query = 'INSERT INTO comments (user_id, photo_id, text) VALUES ($1::int, $2::int, $3::text)';

    pool.query(query,params, function(err, result) {
    // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.redirect('/photo_comments/' + photoId);
    });
});

module.exports = router;
