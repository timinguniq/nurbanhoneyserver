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

// 토큰 없이 이용 가능한 통신들

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (req, res) => {
    let id = req.query.id;

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["id", "uuid", "thumbnail", "title", "lossCut", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
            "badge", "nickname", "insignia", "myRating", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, null, null, 
                null, null, null, null, "input is null"];
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
        let lossCut = result.lossCut;
        let content = result.content;
        let count = result.count;
        articleCount = count;
        let commentCount = result.commentCount;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updatedAt = result.updatedAt;
        let userId = result.User.userId;
        let badge = result.User.badge;
        let nickname = result.User.nickname;
        let insignia = result.User.insigniaShow;
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

        let nameList = ["id", "uuid", "thumbnail", "title", "lossCut", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "badge", "nickname", "insignia", "myRating", "error"];
        let valueList = [articleId, uuid, thumbanil, title, lossCut, content, count, commentCount, likeCount, dislikeCount, updatedAt, 
                badge, nickname, insignia, myRating, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    }catch(err){
        let nameList = ["id", "uuid", "thumbnail", "title", "lossCut", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "badge", "nickname", "insignia", "myRating", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, null, null, 
                null, null, null, null, "article is not exist"];
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

module.exports = router;