var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/* GET login page. */

router.get('/', function(req, res, next) {
    const session = req.session;
    if (session && session.userId) {
        // Logout page
        res.render('login', {});
    } else {
        // Login page
        res.render('login', {});
    }
});

router.get('/newuser', function(req, res, next) {
    res.render('newuser', {});
});

/* Check user page */

router.get('/checkuser', function(req, res, next) {
const login = req.query.login;
const password = req.query.password;
const query = 'SELECT id, username, password_hashed FROM users where login=$1::text';
const params = [login];
    pool.query(query,params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }

        const record = result.rows;
        if(record && record.length > 0) {
            const userDao = record[0];
            const stored_hash = userDao.password_hashed;
            bcrypt.compare(password, stored_hash, function(err, passwordIsValid) {
                if(passwordIsValid) {
                   // Passwords match
                        req.session.userId = userDao.id;
                        req.session.userName = userDao.username;
                        //returning to homepage
                        res.redirect('/');
                } else {
                   // Passwords don't match
                   res.render('error', {message: 'Invalid login or password', error: {status : '', stack : ''}});
                } 
            });
             
        } else {
            // More than one record or no data
            res.render('error', {message: 'No such user', error: {status : '', stack : ''}});
        }
    });
});

//Add new user

router.post('/newuser', [
  check('username').isLength({ min: 3 }).trim().escape(),
  check('login').isLength({ min: 3 }).trim().escape(),
  check('password').isLength({ min: 3 }).trim().escape()
],function(req, res, next) {
    const username = req.body.username;
    const login = req.body.login;
    const password = req.body.password;
    const paramsTest = [username, login];
    const queryTest = 'SELECT username,login FROM users where username=$1::text OR login=$2::text';
    pool.query(queryTest, paramsTest, function(err, result) {
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
                const query = 'INSERT INTO users (username, login, password_hashed, timestamp) VALUES ($1::text, $2::text, $3::text, CURRENT_TIMESTAMP) RETURNING id';
                const params = [username, login, hash ];
                pool.query(query,params, function(err, result) {
                // If an error occurred...
                if (err) {
                    console.log("Error in query: ")
                    console.log(err);
                }
                //Success !
                    const insertedId = result.id;
                    const session = req.session;
                    session.userId = insertedId;
                    session.userName = username;
                    //returning to homepage
                    res.render('index', { title: 'PhotoGram', userId:insertedId, userName:username });
                });
            });   
        } else {
            res.render('error', {message: 'User exists', error: {status : '', stack : ''}});
        }
    });
});


module.exports = router;
