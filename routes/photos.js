var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});
const session = require('express-session');
const AMAZON_URL = 'https://byuiproject03.s3.eu-central-1.amazonaws.com';

/* GET home page. */

router.get('/:userId', function(req, res, next) {
const id = req.params.userId;
const userName = req.session.userName;
const query = 'select filename,photos.id as photoId from photo_users left join photos on photos.id=photo_users.photo_id where photo_users.user_id=$1::int';
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
                rObj['permalink'] = AMAZON_URL + '/'+id+'/'+row.filename;
                rObj['hreflink'] = '/photo_comments/'+row.photoid;
                return rObj;});  
            res.render('photos', {photos: recordMapped, userName:userName });
        } else {
            res.render('error', {message: 'No data', error: {status : '', stack : ''}});
        }
    });    
});

module.exports = router;
