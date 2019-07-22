var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const dbHelper = require('./dbHelper.js');

/* GET home page. */

router.get('/:photoId', function(req, res, next) {
const session = require('express-session');
const photoId = req.params.photoId;
const query = 'select username, text, filename from comments left join users on users.id=comments.user_id left join photos on photos.id=comments.photo_id where comments.photo_id=$1::int';
const params = [photoId];

dbHelper.getUserIdFilename(photoId)
                        .then((row) => {
                            //@TODO remove callback hell to dbHelper
                            const srcFileName = 'https://byuiproject03.s3.eu-central-1.amazonaws.com/'+row.user_id+'/'+row.filename;
                            pool.query(query,params, function(err, result) {
                            // If an error occurred...
                            if (err) {
                                console.log("Error in query: ")
                                console.log(err);
                                res.status(500).send(err);
                            }

                            const record=result.rows;
                            if(record.length > 0) {
                                    const recordMapped = record.map(row => { 
                                        const rObj = {};
                                        rObj['username'] = row.username;
                                        rObj['text'] = row.text;
                                        return rObj;});
                                   
                                    res.render('photo_comments', {comments: recordMapped, filename: result.filename, photoId: photoId, src: srcFileName });
                                } else {
                                    res.render('photo_comments', {comments: [], filename: result.filename, photoId: photoId, src: srcFileName });
                                    //res.render('error', {message: 'No data', error: {status : '', stack : ''}});
                                }
                            });    
                        })
                        .catch((err) => { res.status(500).send(err);})

});

router.post('/:photoId', function(req, res, next) {
    const photoId = req.params.photoId;
    const comment = req.body.comment;
    if (req.session) {
        const userId = req.session.userId;
        const query = 'INSERT INTO comments (user_id, photo_id, text) VALUES ($1::int, $2::int, $3::text)';
        const params = [userId, photoId, comment];
        pool.query(query,params, function(err, result) {
        // If an error occurred...
        if (err) {
            console.log("Error in query: ")
            console.log(err);
        }
        res.redirect('/photo_comments/' + photoId);
    });
    //session not found    
    } else {
        res.redirect('/login');
    }
    
});

module.exports = router;
