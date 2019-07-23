var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const session = require('express-session');
const AMAZON_URL = 'https://byuiproject03.s3.eu-central-1.amazonaws.com';

/* GET home page. */

router.get('/', function(req, res, next) {
const userName = req.session.userName;
const query = 'SELECT COUNT (DISTINCT filename), comments.photo_id as photo_id,photo_users.user_id,filename from comments LEFT JOIN photos on photos.id=photo_id LEFT JOIN photo_users on comments.photo_id = photo_users.photo_id GROUP BY comments.photo_id, photo_users.user_id,filename';
const params = [];
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
                rObj['permalink'] = AMAZON_URL + '/'+row.user_id+'/'+row.filename;
                rObj['hreflink'] = '/photo_comments/'+row.photo_id;
                return rObj;});  
            res.render('photos', {photos: recordMapped, userName:userName });
        } else {
            res.render('error', {message: 'No data', error: {status : '', stack : ''}});
        }
    });    
});

module.exports = router;
