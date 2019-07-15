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

													
//Name of the file : dropbox-file-upload.js
//Including the required moduless
var request = require('request');
var fs = require('fs');

//enter your access token
var access_token = "WRITE_YOUR_ACCESS_TOKEN_HERE";
//Name of the file to be uploaded
var filename = '44.png';
//reading the contents 
var content = fs.readFileSync(filename);
//write your folder name in place of YOUR_PATH_TO_FOLDER
// For example if the folder name is njera then we can write it in the following way :
// "Dropbox-API-Arg": "{\"path\": \"/njera/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}"
options = {
            method: "POST",
            url: 'https://content.dropboxapi.com/2/files/upload',
            headers: {
              "Content-Type": "application/octet-stream",
              "Authorization": "Bearer " + access_token,
              "Dropbox-API-Arg": "{\"path\": \"/Project02/"+filename+"\",\"mode\": \"overwrite\",\"autorename\": true,\"mute\": false}",
            },
            body:content
};

request(options,function(err, res, body){
     console.log("Err : " + err);
     console.log("res : " + res);
     console.log("body : " + body);    
 })
													
													

module.exports = router;
 