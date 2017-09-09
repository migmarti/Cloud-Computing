const aws = require('aws-sdk');
const s3 = new aws.S3();

var getParams = {
        Bucket: 'cc414-images',
        Key: 'scientist.png'
}

s3.getObject(getParams, function(err, data) {
    if (err){
        console.log(err);
        return err;
    }
    else if (data.Metadata) {
  	var putParams = {
            Bucket: 'cc414-images',
            Key: '20159/image.png',
            Body: data.Body
        }
        s3.putObject(putParams, function(err, res) {
            if(err){
                console.log(err);
                return err;
            }
            else {
                console.log("Successfully uploaded image to " + putParams.Key + 
			    " in bucket " + putParams.Bucket);
            }
        });
    }
});
