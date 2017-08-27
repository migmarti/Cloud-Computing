var AWS = require('aws-sdk');
var s3 = new AWS.S3();

var params = {
	Bucket:'mmartbucket', 
	Key: 'index.html'}

s3.getObject(params, function(err, data) {
	if (err) console.log(err, err.stack); 
	else console.log('The last modified date of '+ params.Key + ' in ' + params.Bucket + ' is: ' + data.LastModified); 
});
