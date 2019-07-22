const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
const pool = new Pool({connectionString: connectionString});

module.exports.writeFileToDb = function(filename){
	return new Promise(function(resolve, reject) {

		const query = 'INSERT INTO photos (filename) VALUES ($1::text) RETURNING id';
	    const params = [filename];
	    pool.query(query,params, function(err, result) {
	    // If an error occurred...
	        if (err) {
	            console.log("Error in query: ")
	            console.log(err);
	            reject(err);
	        } else {
	        	//should return last added id
	        	if(result.rows[0] && result.rows[0].id) {
	        		resolve(result.rows[0].id);	
	        	} else {
	        		reject('insert id not created');
	        	}
	        }
	    });
	});
};

module.exports.writeFileIdToDb = function(userId, photoId){
	return new Promise(function(resolve, reject) {

		const query = 'INSERT INTO photo_users (user_id, photo_id) VALUES ($1::int, $2::int)';
	    const params = [userId, photoId];
	    pool.query(query,params, function(err, result) {
	        if (err) {
	            console.log("Error in query: ")
	            console.log(err);
	            reject(err);
	        } else {
	        	resolve('Successfully added data to database');	
	        }
	    });
	});
};


