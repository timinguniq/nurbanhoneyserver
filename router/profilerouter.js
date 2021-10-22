var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractUserId');

// 프로필 관련 통신
// 유저 데이터 받아오는 통신
router.get('/', async (req, res) => {
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObject = new Object();
    let resultObject = new Object();

    try{
        let result = await userDao.read(key);
        console.log("result", result);
        let id = result.id;
        let loginType = result.loginType;
        let profile = result.profile;
        let nickname = result.nickname;
        let description = result.description;
        let point = result.point;
        let insignia = result.insignia;

        let nameList = ["id", "loginType", "profile", "nickname", "description", "point", "insignia", "error"];
        let valueList = [id, loginType, profile, nickname, description, point, insignia, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }catch(err){
        console.log("err", err);
        let nameList = ["id", "loginType", "profile", "nickname", "description", "point", "insignia", "error"];
        let valueList = [null, null, null, null, null, null, null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }
    res.json(resultObject);
});

// 프로필 이미지 변경 통신
router.post('/', async (req, res) => {
    let imageFile = req.files;
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);
   
    // 키값으로 userId 값 얻어내기
    userId = await extractUserId(key);
        
    let imageFileName = "profile";
    
    let bufferObj = JSON.parse(JSON.stringify(imageFile[0].buffer));
    let bodyBuffer = new Buffer.from(bufferObj.data);  

    // s3에 파일 업로드 하는 메소드
    s3upload(awsObj.s3nurbanhoneyprofilename, userId, imageFileName, bodyBuffer, (resultObject) => {
        res.json(resultObject);
    });
});

// 닉네임 변경 통신
router.patch('/nickname', async (req, res) => {
    let changeNickname = req.body.nickname;
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObject = new Object();
    let resultObject = new Object();
    
    try{
        let result = await userDao.updateNickname(key, changeNickname);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result[0], null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_nickname_revise_result", contentObject);
    }catch(err){
        console.log(`patch err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_nickname_revise_result", contentObject);
    }
    res.json(resultObject);
});

// 설명 변경 통신
router.patch('/description', async (req, res) => {
    let changeDescription = req.body.description;
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObject = new Object();
    let resultObject = new Object();
    
    try{
        let result = await userDao.updateDescription(key, changeDescription);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result[0], null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_description_revise_result", contentObject);
    }catch(err){
        console.log(`patch err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_description_revise_result", contentObject);
    }
    res.json(resultObject);
});

module.exports = router;