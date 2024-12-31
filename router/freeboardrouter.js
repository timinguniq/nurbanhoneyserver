var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
let constObj = require('../config/const');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let createFreeMyrating = require('../utils/createfreemyrating');
let getInsigniaShown = require('../utils/getinsigniashown');


const totalBoardDao = require('../dbdao/totalboarddao');

// 토큰 없이 이용 가능한 통신들

let preDate = 0;
// 글 상세 데이터 받아오는 메소드
router.get('/article', async (req, res) => {
    let id = req.query.id;
    let token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    if(token !== null && token !== undefined){
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // 키값으로 userId값 가져오기
        userId = await extractUserId(key);
    }

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    let articleCount = 0
    // id 값으로 데이터 읽기
    try{
        //let result = await freeBoardDao.readForId(id);
        let result = await totalBoardDao.readForId(id);

        let articleId = result.id;
        let uuid = result.uuid;
        let thumbnail = result.thumbnail;
        let title = result.title;
        let content = result.content;
        let count = result.count;
        articleCount = count;
        let commentCount = result.commentCount;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updatedAt = result.updatedAt;
        let authorUserId = result.user.dataValues.userId;
        let badge = result.user.badge;
        let nickname = result.user.nickname;
        let insignia = await getInsigniaShown(authorUserId);
        let myRating = null;

        if(userId !== null && userId !== undefined){
            // 좋아요 데이터 받아오는 코드
            myRating = await createFreeMyrating(articleId, userId);
        }

        let nameList = ["id", "uuid", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updatedAt", 
                "userId", "badge", "nickname", "insignia", "myRating"];
        let valueList = [articleId, uuid, thumbnail, title, content, count, commentCount, likeCount, dislikeCount, updatedAt, 
            authorUserId, badge, nickname, insignia, myRating];
        resultObject = createJson.multi(nameList, valueList);
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("article is not exist");
        res.status(500).json(resultObject);
    }
  
    let curDate = new Date();
    // 조회수 카운트 플러스하는 코드
    try{
        console.log(`curDate : ${curDate}, preDate : ${preDate}`);
        if(curDate - preDate >= constObj.countInterval){
            //let result = await freeBoardDao.updateCount(id, ++articleCount);
            let result = await totalBoardDao.updateCount(id, ++articleCount);
            console.log(`freeboard detail updateCount result : ${result}`);      
        }
    }catch(err){
        console.log(`freeboard detail updateCount err : ${err}`);
    }

    preDate = curDate;
})

// 글 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let articleId = req.query.articleId;
    let flag = req.query.flag;
    let limit = req.query.limit;    

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [flag];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    let token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    if(token !== null && token !== undefined){
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // 키값으로 userId값 가져오기
        userId = await extractUserId(key);
    }

    // 썸네일, 제목, 댓글 개수
    try{
        let result;
        let iFlag = Number(flag);
        if(iFlag === constObj.defaultOrder){
            //result = await freeBoardDao.read(articleId, limit);
            result = await totalBoardDao.readFree(articleId, limit);
        }else if(iFlag === constObj.countOrder){
            //result = await freeBoardDao.readCount(articleId, limit);
            result = await totalBoardDao.readCountFree(articleId, limit);
        }else if(iFlag === constObj.likeCountOrder){
            //result = await freeBoardDao.readLikeCount(articleId, limit);
            result = await totalBoardDao.readLikeCountFree(articleId, limit);
        }else{
            // 에러
            resultObject = createJson.error("flag is not correct");
            res.status(400).json(resultObject);
            return res.end()
        }
        console.log("result", result);

        let myRating = null;

        if(userId !== null && userId !== undefined){
            // 좋아요 데이터 받아오는 코드
            myRating = await createFreeMyrating(articleId, userId);
        }

        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            result[i].dataValues.user.dataValues.insignia = await getInsigniaShown(result[i].dataValues.user.dataValues.userId);

            result[i].dataValues.myRating = myRating;

            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 글 좋아요, 싫어요 갯수 및 myRating
router.get('/article/myrating', async (req, res) => {
    let articleId = req.query.articleId;
    let token = req.headers.authorization?.replace('Bearer ', '');
    let userId = null;

    if(token !== null && token !== undefined){
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // 키값으로 userId값 가져오기
        userId = await extractUserId(key);
    }

    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // id 값으로 데이터 읽기
    try{
        //let result = await freeBoardDao.readForId(articleId);
        let result = await totalBoardDao.readForId(articleId);

        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let myRating = null;

        if(userId !== null && userId !== undefined){
            myRating = await createFreeMyrating(articleId, userId);
        }

        let nameList = ["id", "likeCount", "dislikeCount", "myRating"];
        let valueList = [articleId, likeCount, dislikeCount, myRating];
        resultObject = createJson.multi(nameList, valueList);
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("article is not exist");
        res.status(500).json(resultObject);
    }  
});


module.exports = router;