const express = require('express');
const router = express.Router();
const session = require('express-session');
const fileUpload = require('express-fileupload');
const app = express();
var multer  = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage }).single('uploadedFile');	

// default options
const shell = require('shelljs');
const aws = require('aws-sdk');
const S3_BUCKET = (process.env.S3_BUCKET_NAME);
const s3 = new aws.S3(
	{

	//https://stackoverflow.com/questions/26533245/the-authorization-mechanism-you-have-provided-is-not-supported-please-use-aws4
    endpoint: 's3-eu-central-1.amazonaws.com',
    signatureVersion: 'v4',
    region: 'eu-central-1',
    PathStyle: true
    /*
    last error:
    Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://byuiproject02.s3-eu-central-1.amazonaws.com/flower.jpeg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIQ6TRG75TFDRBLOQ%2F20190715%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20190715T160343Z&X-Amz-Expires=60&X-Amz-Signature=eea4f7c22d256d63388d08943b8b342b2c82ee981544bc4ed8839c80309c3f78&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).[Learn More]
     Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://byuiproject02.s3-eu-central-1.amazonaws.com/flower.jpeg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIQ6TRG75TFDRBLOQ%2F20190715%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20190715T160343Z&X-Amz-Expires=60&X-Amz-Signature=eea4f7c22d256d63388d08943b8b342b2c82ee981544bc4ed8839c80309c3f78&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read. (Reason: CORS request did not succeed).[Learn More]
    */
	} );

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

router.post('/', function(req, res, next) {
	if (req.session) {
		const userId = req.session.userId;
		const userName = req.session.userName;
		if (Object.keys(req.files).length == 0) {
    		return res.status(400).send('No files were uploaded.');
    		} else {

			  console.log('starting upload to Multer');
			  upload(req, res, function (err) {
			    if (err instanceof multer.MulterError) {
			      // A Multer error occurred when uploading.
			       res.status(400).send(err);
			    } else if (err) {
			      // An unknown error occurred when uploading.
			       res.status(400).send(err);	
			    }
			    // Everything went fine.
	  	    	    console.log('starting upload to Amazon S3')
	
					const myKey = 'pngFile.png';

					console.log(req);
				 	const params = {
				 		Bucket: S3_BUCKET,
				 	 	Key: myKey, 
				 	 	Body: req.files.uploadedFile.buffer,
				 	 	ContentType: 'application/octet-stream'
				 	 	};

				     s3.putObject(params, function(err, data) {

			         if (err) {
			         	 console.log(err)
			             res.status(400).send(err);	
			         	} else {
			             console.log("Successfully uploaded data to myBucket/myKey");
			             return res.status(200).send('Successfully uploaded data to myBucket/myKey');
			         }
			     	});
  				});
    		  // Callback hell @TODO refactor to promises
			 
    	}
	} else {
		res.redirect('/login');	
	} 
});


/* POST upload. *//*
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

*/
module.exports = router;
