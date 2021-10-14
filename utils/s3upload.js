let awsObj = require('../config/aws.js');
let AWS = require('aws-sdk');

AWS.config.update({
    region: awsObj.region,
    accessKeyId: awsObj.accessKeyId,
    secretAccessKey: awsObj.secretAccessKey
});

// s3에 파일 업로드 하는 메소드
module.exports = (articleId, imageFileName, bodyBuffer) => {
    let s3 = new AWS.S3();
    let param = {
        'Bucket' : awsObj.s3nurbanboardname,
        'Key' : `${articleId}/${imageFileName}`,
        'ACL' : 'public-read',
        'Body' : bodyBuffer,
        'ContentType' : 'image/png'
    }

    s3.upload(param, (err, data) => {
        if(err !== null){
            // 에러가 있음
            let nameList = ["result", "error"];
            let valueList = [null, err];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("nurbanboard_image_result", contentObject);
            return resultObject
        }else{
            // 에러가 없음
            let location = data.Location;
            let nameList = ["result", "error"];
            let valueList = [location, null];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("nurbanboard_image_result", contentObject);
            return resultObject
        }
    });
}