var express = require('express');
var router = express.Router();
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanLikeDao = require('../dbdao/nurbanlikedao');
const nurbanDislikeDao = require('../dbdao/nurbandislikedao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var s3upload = require('../utils/s3upload');
var s3delete = require('../utils/s3delete');
let inputErrorHandler = require('../utils/inputerrorhandler');
let awsObj = require('../config/aws');
let constObj = require('../config/const');

// 토큰 있어야 가능한 통신

// 글 생성 
router.post('/', async (req, res) => {
    let uuid = req.body.uuid;
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let lossCut = req.body.lossCut;
    let content = req.body.content;
    let userId = '';

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [uuid, thumbnail, title, lossCut, content];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);   
        res.json(resultObject);
        return res.end();
    }

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // key 값으로 User 테이블의 id 값 받아오기
    try{
        let result = await userDao.read(key);
        userId = result.id;
    }catch(err){
        console.log(`userDao err : ${err}`);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 글 작성
    try{
        let result = await nurbanBoardDao.create(uuid, thumbnail, title, lossCut, content, userId);
        console.log(`create : ${result}`);
        if(result !== null){
            // point 올리는 로직
            let userResult = await userDao.read(key)
            let point = userResult.point;
            point += constObj.writePoint;
            let userUpdateResult = await userDao.updatePoint(key, point);
        }
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
    }catch(err){
        console.log(`create nurbanboardDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
    }
    res.json(resultObject);
});

// 글 수정 관련 통신 메소드
router.patch('/', async (req, res) => {
    let id = req.body.id;
    // 나중에 thumbanil 처리해줘야됨.
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let content = req.body.content;
    
    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id, thumbnail, title, content];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_revise_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    try{
        let result = await nurbanBoardDao.updateContent(id, thumbnail, title, content);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result[0], null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_revise_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`patch err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_revise_result", contentObject);
        res.json(resultObject);
    }
});

// 글 삭제 관련 통신 메소드
router.delete('/', async (req, res) => {
    let id = req.query.id;
    let uuid = req.query.uuid;

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id, uuid];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    try{
        let result = await nurbanBoardDao.destory(id);
        // result 1이면 성공 0이면 실패
        console.log(`delete result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_delete_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`delete err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // s3에 글 이미지 삭제하기
    s3delete(awsObj.s3nurbanboardname, uuid);
});

// 글 관련 이미지 업로드
router.post('/upload/image', async (req, res) => {
    let imageFiles = req.files;
    let uuid = req.body.uuid;

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [imageFiles, uuid];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_image_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    let imageFileNameSize = JSON.stringify(imageFiles[0].originalname).split('\\').length;
    let imageFileName = JSON.stringify(imageFiles[0].originalname).split('\\')[imageFileNameSize-1];
    
    let bufferObj = JSON.parse(JSON.stringify(imageFiles[0].buffer));
    let bodyBuffer = new Buffer.from(bufferObj.data);  
    let resultString = "nurbanboard_image_result";

    // s3에 파일 업로드 하는 메소드
    s3upload(awsObj.s3nurbanboardname, uuid, imageFileName, bodyBuffer, resultString, (resultObject) => {
        res.json(resultObject);
    });
});

// 글 관련 이미지 삭제하는 통신
router.delete('/upload/image', async (req, res) => {
    let uuid = req.query.uuid;
    
    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [uuid];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_image_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    try{
        // s3에 글 이미지 삭제하기
        let result = await s3delete(awsObj.s3nurbanboardname, uuid);

        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_image_delete_result", contentObject);
        res.json(resultObject);
    }catch(err){
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_image_delete_result", contentObject);
        res.json(resultObject);
    }    
});

module.exports = router;