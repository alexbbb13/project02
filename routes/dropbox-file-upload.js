var express = require('express');
var router = express.Router();
const session = require('express-session');
const fileUpload = require('express-fileupload');
const shell = require('shelljs');

/* GET upload. */
router.get('/', function(req, res, next) {
	if (req.session) {
		const userId = req.session.userId;
		const userName = req.session.userName;
		res.render('upload', {});		
	} else {
		res.redirect('/login');
	}   
});

/* POST upload. */
router.post('/', function(req, res, next) {
	if (req.session) {
		const userId = req.session.userId;
		const userName = req.session.userName;
		if (Object.keys(req.files).length == 0) {
    		return res.status(400).send('No files were uploaded.');
    		} else {
    		  const sampleFile = req.files.upload;
			  // Use the mv() method to place the file somewhere on your server

			  const fileDir = '/uploads/'+userId+'/';
			  const fileName = 'filename.png';  
			  const fs = require("fs"); // Or `import fs from "fs";` with ESM
			  const fullPath = fileDir + fileName;
				if (fs.existsSync(fileDir)) {
				    //Path exists
				} else {
					//Create path
					shell.mkdir('-p', fileDir);
				}
			  
			  sampleFile.mv(fullPath, function(err) {
			    if (err) return res.status(500).send(err);
                //@TODO Write to database 
			    res.send('File uploaded!');
  				});
    	}

	} else {
		res.redirect('/login');	
	}   
	
});

function 
												

module.exports = router;
 