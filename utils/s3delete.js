let awsObj = require('../config/aws.js');
let AWS = require('aws-sdk');

AWS.config.update({
    region: awsObj.region,
    accessKeyId: awsObj.accessKeyId,
    secretAccessKey: awsObj.secretAccessKey
});

module.exports = async function emptyS3Directory(bucket, dir) {
    let s3 = new AWS.S3();
    
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] }
    };

    listedObjects.Contents.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}