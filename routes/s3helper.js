const aws = require('aws-sdk');
const S3_BUCKET = (process.env.S3_BUCKET_NAME);
const s3 = new aws.S3(
	{
    endpoint: 's3-eu-central-1.amazonaws.com',
    signatureVersion: 'v4',
    region: 'eu-central-1',
    PathStyle: true
	} );

module.exports.writeFile = function(userId, filename, buffer){
	return new Promise(function(resolve, reject) {
		const myKey = userId + '/' + filename;
		const params = {
		Bucket: S3_BUCKET,
	 	Key: myKey, 
	 	Body: buffer,
	 	ContentType: 'application/octet-stream'
		};
    	s3.putObject(params, function(err, data) {
        if (err) {
	      		console.log(err)
				reject(err);	
			} else {
			    console.log("Successfully uploaded data to myBucket/myKey");
			    resolve('Successfully uploaded data to myBucket/myKey');
			}	
  		});
	});
};


