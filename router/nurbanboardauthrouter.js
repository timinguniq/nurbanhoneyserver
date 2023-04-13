var express = require('express');
var router = express.Router();
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanLikeDao = require('../dbdao/nurbanlikedao');
const nurbanDislikeDao = require('../dbdao/nurbandislikedao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
var s3upload = require('../utils/s3upload');
var s3delete = require('../utils/s3delete');
let inputErrorHandler = require('../utils/inputerrorhandler');
let awsObj = require('../config/aws');
let constObj = require('../config/const');
let raisePoint = require('../utils/raisepoint');
let dropPoint = require('../utils/droppoint');
let dropTotalLossCut = require('../utils/droptotallosscut');
let isApproveLossCut = require('../utils/isapprovelosscut');

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
    let inputArray = [uuid, title, lossCut, content];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");   
        res.status(400).json(resultObject);
        return res.end();
    }

    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // key 값으로 User 테이블의 id 값 받아오기
    try{
        let result = await userDao.read(key);
        userId = result.id;
    }catch(err){
        console.log(`userDao err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 글 작성
    try{
        let result = await nurbanBoardDao.create(uuid, thumbnail, title, lossCut, content, userId);
        console.log(`create : ${result}`);

        // 포인트를 올리는 메소드
        if(!raisePoint(key, constObj.writeArticlePoint)){
            console.log("raisePoint error");
        }

        resultObject = createJson.result("nurbanboard_posted");
        res.status(201).json(resultObject);
    }catch(err){
        console.log(`create nurbanboardDao err : ${err}`);
        resultObject = createJson.error(err);
        res.status(400).json(resultObject);
    }
});

// 글 수정 관련 통신 메소드
router.patch('/', async (req, res) => {
    let id = req.body.id;
    // 나중에 thumbanil 처리해줘야됨.
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let lossCut = req.body.lossCut;
    let content = req.body.content;
    console.log('req.header: ', req.headers);
    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id, thumbnail, title, content];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    try{
        let result = await nurbanBoardDao.updateContent(id, thumbnail, title, lossCut, content);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        if(result[0] === 1){
            resultObject = createJson.result("nurbanboard_updated");
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("nurbanboard_updated_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        console.log(`patch err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 글 삭제 관련 통신 메소드
router.delete('/', async (req, res) => {
    let id = req.body.id;
    let uuid = req.body.uuid;
    let token = req.headers.authorization?.replace('Bearer ', '');
    let key = null;
    let userId = null;

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id, uuid];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    if(token !== null && token !== undefined){      
        // 토큰에서 키 값 추출
        key = extractKey(token);

        // 키값으로 userId값 가져오기
        userId = await extractUserId(key);
    }

    let deleteResult = null;
    try{
        let readResult = await nurbanBoardDao.readForId(id);
        console.log("readResult userId : ", readResult);
        let articleUserId = readResult.userId;
        console.log("readResult userId 2 : ", articleUserId);
        if(userId !== articleUserId){
            resultObject = createJson.error("access impossible");
            res.status(401).json(resultObject);
            return res.end();
        }else{
            deleteResult = await nurbanBoardDao.destory(id);
        }
                
        // deleteResult 1이면 성공 0이면 실패
        console.log(`delete result : ${deleteResult}`)
        
        if(deleteResult === 1){
            resultObject = createJson.result("nurbanboard_deleted");
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("nurbanboard_deleted_fail");
            res.status(700).json(resultObject);
            return res.end();
        }

        // 좋아요 수 - 싫어요 수
        let diffLikeDislikeCount = readResult.likeCount - readResult.dislikeCount;
        // 좋아요 싫어요 정산 포인트 
        let diffPoint = diffLikeDislikeCount * constObj.likePoint;
        // 좋아요 싫어요 포인트 정산
        if(!raisePoint(key, diffPoint)){
            console.log("raisePoint error");
        }
        // 포인트를 내리는 메소드
        if(!dropPoint(key, constObj.writeArticlePoint)){
            console.log("dropPoint error");
        }
        // totalLossCut에 반영이 됬는지 확인하는 변수
        let reflectLossCut = readResult.reflectLossCut;
        if(reflectLossCut){
            // 총 손실액 내리는 메소드
            if(!dropTotalLossCut(key, id)){
                console.log("dropTotalLossCut error");
            }
        }
    }catch(err){
        console.log(`delete err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    if(deleteResult === 1){
        // s3에 글 이미지 삭제하기
        s3delete(awsObj.s3nurbanboardname, uuid);
    }
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
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // uuid인 아티클이 없으면 에러
    let nurbanArticle = await nurbanBoardDao.readForUuid(uuid);
    console.log('nurbanArticle : ', nurbanArticle);

    if(nurbanArticle === null){
        resultObject = createJson.error("article is not exist");
        res.status(404).json(resultObject);
        return res.end();
    }
    //

    let imageFileNameSize = JSON.stringify(imageFiles[0].originalname).split('\\').length;
    let imageFileName = JSON.stringify(imageFiles[0].originalname).split('\\')[imageFileNameSize-1];
    
    let bufferObj = JSON.parse(JSON.stringify(imageFiles[0].buffer));
    let bodyBuffer = new Buffer.from(bufferObj.data);

    // s3에 파일 업로드 하는 메소드
    s3upload(awsObj.s3nurbanboardname, uuid, imageFileName, bodyBuffer, (resultObject) => {
        if(resultObject.result !== null && resultObject.result !== undefined){
            res.status(200).json(resultObject);
        }else{
            res.status(500).json(resultObject);    
        }
    });
});

// 글 관련 이미지 삭제하는 통신
router.delete('/upload/image', async (req, res) => {
    let uuid = req.body.uuid;
    
    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [uuid];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    try{
        // s3에 글 이미지 삭제하기
        let result = await s3delete(awsObj.s3nurbanboardname, uuid);

        resultObject = createJson.result("nurbanboard_image_deleted");
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("error");
        res.status(500).json(resultObject);
    }    
});

module.exports = router;