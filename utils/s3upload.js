let awsObj = require('../config/aws.js');
let AWS = require('aws-sdk');
let createJson = require('../utils/createjson');

AWS.config.update({
    region: awsObj.region,
    accessKeyId: awsObj.accessKeyId,
    secretAccessKey: awsObj.secretAccessKey
});

// s3에 파일 업로드 하는 메소드
module.exports = async (bucketName, folderName, imageFileName, bodyBuffer, callback) => {
    let s3 = new AWS.S3();
    let param = {
        'Bucket' : bucketName,
        'Key' : `${folderName}/${imageFileName}`,
        'ACL' : 'public-read',
        'Body' : bodyBuffer,
        'ContentType' : 'image/png'
    }

    await s3.upload(param, (err, data) => {
        if(err !== null){
            // 에러가 있음
            let resultObject = createJson.error(err);
            console.log('s3 upload err : ', err);
            return callback(resultObject)
        }else{
            // 에러가 없음
            let resultObject = createJson.result(data.Location);
            console.log('s3 upload resultObejct : ', resultObject);
            return callback(resultObject)
        }
    });
}