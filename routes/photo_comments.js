var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

/* GET home page. */

router.get('/:photoId', function(req, res, next) {
const id = req.params.photoId;
const query = 'select username, text from comments left join users on users.id=comments.user_id where comments.photo_id=$1::int';
//const query = 'SELECT * FROM relatives WHERE person_id=$1::int';
const params = [id];
pool.query(query,params, function(err, result) {
    // If an error occurred...
    if (err) {
        console.log("Error in query: ")
        console.log(err);
    }

    // Log this to the console for debugging purposes.
    console.log("Back from DB with result:");
    //res.render('person', { title: result.rows[0].name });
    //const record=result.rows[0]; 
    const record=result.rows;
    const recordMapped = record.map(row => { 
        var rObj = {};
        rObj['username'] = row.username;
        rObj['text'] = row.text;
        return rObj;
    });  
    res.json({comments: recordMapped });

    //res.json({username: [record.father_id, record.mother_id]});
    console.log(result.rows);
	});    
  
});

module.exports = router;
