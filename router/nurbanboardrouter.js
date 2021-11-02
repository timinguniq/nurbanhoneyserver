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

/*
exports.create = function create(thumbnail, title, content, userId){
    return NurbanBoard.create({
        id: 0,
        thumbnail: thumbnail,
        title: title,
        content: content,
        userId: userId
    })
*/

// 글 생성 
router.post('/', async (req, res) => {
    let uuid = req.body.uuid;
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let lossPrice = req.body.lossPrice;
    let content = req.body.content;
    let userId = '';

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [uuid, thumbnail, title, lossPrice, content];
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
        let result = await nurbanBoardDao.create(uuid, thumbnail, title, lossPrice, content, userId);
        console.log(`create : ${result}`);
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

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (req, res) => {
    let id = req.query.id;

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["id", "uuid", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "badge", "nickname", "insignia", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, null, 
                null, null, null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    let articleCount = 0
    // id 값으로 데이터 읽기
    try{
        let result = await nurbanBoardDao.readForId(id);
        let articleId = result.id;
        let uuid = result.uuid;
        let thumbanil = result.thumbanil;
        let title = result.title;
        let content = result.content;
        let count = result.count;
        articleCount = count;
        let commentCount = result.commentCount;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updateAt = result.updateAt;
        let userId = result.User.userId;
        let badge = result.User.badge;
        let nickname = result.User.nickname;
        let insignia = result.User.insignia_show;
        let myRating = null;

        // 좋아요 데이터 받아오는 코드
        try{
            like = await nurbanLikeDao.read(articleId, userId);
            console.log("like result", like);
            if(like !== null){
                myRating = 'like'; 
            }
        }catch(err){
            console.log("like err", err);
        }
        // 싫어요 데이터 받아오는 코드
        try{
            dislike = await nurbanDislikeDao.read(articleId, userId);
            console.log("dislike result", dislike);
            if(dislike !== null){
                myRating = 'dislike';
            }
        }catch(err){
            console.log("dislike err", err);
        }

        let nameList = ["id", "uuid", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "badge", "nickname", "insignia", "myRating", "error"];
        let valueList = [articleId, uuid, thumbanil, title, content, count, commentCount, likeCount, dislikeCount, updateAt, 
                badge, nickname, insignia, myRating, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    }catch(err){
        let nameList = ["id", "uuid", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "badge", "nickname", "insignia", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, null, 
                null, null, null, "article is not exist"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    }
  
    // 조회수 카운트 플러스하는 코드
    try{
        let result = await nurbanBoardDao.updateCount(id, ++articleCount);
        console.log(`nurbanboard detail updateCount result : ${result}`);  
    }catch(err){
        console.log(`nurbanboard detail updateCount err : ${err}`);
    }

})

// 글 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let flag = req.query.flag;
    let offset = req.query.offset;
    let limit = req.query.limit;    

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [flag, offset, limit];
    if(await inputErrorHandler(inputArray)){
        contentObject.error = "input is null";
        resultObject = createJson.one("nurbanboard_list_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        let result;
        let iFlag = Number(flag);
        if(iFlag === constObj.defaultOrder){
            result = await nurbanBoardDao.read(offset, limit);
        }else if(iFlag === constObj.countOrder){
            result = await nurbanBoardDao.readCount(offset, limit);
        }else if(iFlag === constObj.likeCountOrder){
            result = await nurbanBoardDao.readLikeCount(offset, limit);
        }else{
            // 에러
            contentObject.error = "flag is not correct";
            resultObject = createJson.one("nurbanboard_list_result", contentObject);
            res.json(resultObject);
            return res.end()
        }
        console.log("result", result);

        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        //console.log(`result.rows : ${result.rows}`);
        //resultObject = createJson.one("nurbanboard_list_result", contentObjectList);
        res.json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        contentObject.error = err;
        resultObject = createJson.one("nurbanboard_list_result", contentObject);
        res.json(resultObject);
    }
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