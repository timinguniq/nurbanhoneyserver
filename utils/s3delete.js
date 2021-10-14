let awsObj = require('../config/aws.js');
let AWS = require('aws-sdk');

AWS.config.update({
    region: awsObj.region,
    accessKeyId: awsObj.accessKeyId,
    secretAccessKey: awsObj.secretAccessKey
});

module.exports = function emptyBucket(bucketName, callback){
    var params = {
      Bucket: bucketName,
      Prefix: 'folder/'
    };
    
    let s3 = new AWS.S3();
    s3.listObjects(params, function(err, data) {
      if (err) return callback(err);
  
      if (data.Contents.length == 0) callback();
  
      params = {Bucket: bucketName};
      params.Delete = {Objects:[]};
      
      data.Contents.forEach(function(content) {
        params.Delete.Objects.push({Key: content.Key});
      });
  
      s3.deleteObjects(params, function(err, data) {
        if (err) return callback(err);
        if (data.IsTruncated) {
          emptyBucket(bucketName, callback);
        } else {
          callback();
        }
      });
    });
  }