var express = require('express');
var router = express.Router();
const session = require('express-session');
const fileUpload = require('express-fileupload');
const shell = require('shelljs');
const aws = require('aws-sdk');
const S3_BUCKET = (process.env.S3_BUCKET||'byuiproject02');
/*
Do not forget to set 
AWS_ACCESS_KEY_ID=
and AWS_SECRET_ACCESS_KEY=
because 
Initialising the s3 object automatically loads the 
AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY variables that were 
set into the environment earlier.
*/


/* GET upload. */
router.get('/', (req, res) => {
  const s3 = new aws.S3(
	{

	//https://stackoverflow.com/questions/26533245/the-authorization-mechanism-you-have-provided-is-not-supported-please-use-aws4
    endpoint: 's3-eu-central-1.amazonaws.com',
    signatureVersion: 'v4',
    region: 'eu-central-1'
    /*
    last error:
    Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://byuiproject02.s3-eu-central-1.amazonaws.com/flower.jpeg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIQ6TRG75TFDRBLOQ%2F20190715%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20190715T160343Z&X-Amz-Expires=60&X-Amz-Signature=eea4f7c22d256d63388d08943b8b342b2c82ee981544bc4ed8839c80309c3f78&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing).[Learn More]
     Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://byuiproject02.s3-eu-central-1.amazonaws.com/flower.jpeg?Content-Type=image%2Fjpeg&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIQ6TRG75TFDRBLOQ%2F20190715%2Feu-central-1%2Fs3%2Faws4_request&X-Amz-Date=20190715T160343Z&X-Amz-Expires=60&X-Amz-Signature=eea4f7c22d256d63388d08943b8b342b2c82ee981544bc4ed8839c80309c3f78&X-Amz-SignedHeaders=host%3Bx-amz-acl&x-amz-acl=public-read. (Reason: CORS request did not succeed).[Learn More]
    */
	} );
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});

module.exports = router;
