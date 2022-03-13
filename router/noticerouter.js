var express = require('express');
var router = express.Router();
const noticeDao = require('../dbdao/noticedao');
const noticeLikeDao = require('../dbdao/noticelikedao');
const noticeDislikeDao = require('../dbdao/noticedislikedao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let inputErrorHandler = require('../utils/inputerrorhandler');
const constObj = require('../config/const');
let createNoticeMyrating = require('../utils/createnoticemyrating');

// 토큰 없이 이용 가능한 통신들

let preDate = 0;
// 공지사항 상세 데이터 받아오는 메소드
router.get('/article', async (req, res) => {
    let id = req.query.id;
    let token = req.headers.token;
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

    let noticeCount = 0
    // id 값으로 데이터 읽기
    try{
        let result = await noticeDao.readForId(id);
        let noticeId = result.id;
        let title = result.title;
        let content = result.content;
        let count = result.count;
        noticeCount = count;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updatedAt = result.updatedAt;
        let myRating = null;
        let authorUserId = result.User.dataValues.userId;
        let badge = result.User.badge;
        let nickname = result.User.nickname;
        let insignia = result.User.dataValues.insignia;
        insignia = JSON.parse(insignia);

        if(userId !== null && userId !== undefined){
            // myRating 만드는 메소드
            myRating = await createNoticeMyrating(noticeId, userId);
        }

        let nameList = ["id", "title", "content", "count", "likeCount", "dislikeCount", "updatedAt", "myRating", "userId", "badge", "nickname", "insignia"];
        let valueList = [noticeId, title, content, count, likeCount, dislikeCount, updatedAt, myRating, authorUserId, badge, nickname, insignia];
        resultObject = createJson.multi(nameList, valueList); 
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("notice is not exist");
        res.status(500).json(resultObject);
    }
  
    let curDate = new Date();
    // 조회수 카운트 플러스하는 코드
    try{
        if(curDate - preDate >= constObj.countInterval){
            let result = await noticeDao.updateCount(id, ++noticeCount);
            console.log(`nurbanboard detail updateCount result : ${result}`);    
        }
    }catch(err){
        console.log(`nurbanboard detail updateCount err : ${err}`);
    }
    preDate = curDate;

});

// 공지사항 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let offset = req.query.offset;
    let limit = req.query.limit;   

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [offset, limit];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        let result = await noticeDao.read(offset, limit);
        console.log("result", result);

        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        //console.log(`result.rows : ${result.rows}`);
        //resultObject = createJson.one("nurbanboard_list_result", contentObjectList);
        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 공지사항 내 투표 보는 메소드
router.get('/myrating', async (req, res) => {
    let id = req.query.noticeId;
    let token = req.headers.token;
    let userId = null;

    if(token !== null && token !== undefined){      
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // 키값으로 userId값 가져오기
        userId = await extractUserId(key);
    }

    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // id 값으로 데이터 읽기
    try{
        let result = await noticeDao.readForId(id);
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let myRating = null;

        if(userId !== null && userId !== undefined){
            // myRating 만드는 메소드
            myRating = await createNoticeMyrating(id, userId);
        }

        let nameList = ["id", "likeCount", "dislikeCount", "myRating"];
        let valueList = [id, likeCount, dislikeCount, myRating];
        resultObject = createJson.multi(nameList, valueList); 
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("notice is not exist");
        res.status(500).json(resultObject);
    }
});

module.exports = router;