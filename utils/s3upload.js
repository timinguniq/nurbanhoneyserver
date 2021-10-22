let awsObj = require('../config/aws.js');
let AWS = require('aws-sdk');
let createJson = require('../utils/createjson');

AWS.config.update({
    region: awsObj.region,
    accessKeyId: awsObj.accessKeyId,
    secretAccessKey: awsObj.secretAccessKey
});

// s3에 파일 업로드 하는 메소드
module.exports = async (bucketName, folderName, imageFileName, bodyBuffer, resultString, callback) => {
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
            let nameList = ["result", "error"];
            let valueList = [null, err];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one(resultString, contentObject);
            return callback(resultObject)
        }else{
            // 에러가 없음
            let location = data.Location;
            let nameList = ["result", "error"];
            let valueList = [location, null];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one(resultString, contentObject);
            return callback(resultObject)
        }
    });
}