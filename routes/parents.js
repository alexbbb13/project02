var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL || "'postgres://tcczwvalunvweo:0ac621708a8e8aa557cc8fdde9239e5722935235874f2e89b8c892414f9070a9@ec2-54-83-1-101.compute-1.amazonaws.com:5432/d9vmp7b9ncuv2r?ssl=true";
const pool = new Pool({connectionString: connectionString});

/* GET home page. */

router.get('/:tagId', function(req, res, next) {
var id = req.params.tagId;
const query = 'SELECT * FROM relatives WHERE person_id=$1::int';
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
    const record=result.rows[0]; 
    res.json({parents: [record.father_id, record.mother_id]});
    console.log(result.rows);
	});    
  
});



module.exports = router;
