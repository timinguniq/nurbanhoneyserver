var express = require('express');
var router = express.Router();
const noticeDao = require('../dbdao/noticedao');
const noticeLikeDao = require('../dbdao/noticelikedao');
const noticeDislikeDao = require('../dbdao/noticedislikedao');
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');

// 토큰 없이 이용 가능한 통신들

// 공지사항 상세 데이터 받아오는 메소드
router.get('/detail', async (req, res) => {
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
        let myRating = null

        if(userId !== null && userId !== undefined){
            // 좋아요 데이터 받아오는 코드
            try{
                like = await noticeLikeDao.read(noticeId, userId);
                console.log("like result", like);
                if(like !== null){
                    myRating = 'like'; 
                }
            }catch(err){
                console.log("like err", err);
            }
            // 싫어요 데이터 받아오는 코드
            try{
                dislike = await noticeDislikeDao.read(noticeId, userId);
                console.log("dislike result", dislike);
                if(dislike !== null){
                    myRating = 'dislike';
                }
            }catch(err){
                console.log("dislike err", err);
            }
        }

        let nameList = ["id", "title", "content", "count", "likeCount", "dislikeCount", "updateAt", "myRating"];
        let valueList = [noticeId, title, content, count, likeCount, dislikeCount, updatedAt, myRating];
        resultObject = createJson.multi(nameList, valueList); 
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("notice is not exist");
        res.status(500).json(resultObject);
    }
  
    // 조회수 카운트 플러스하는 코드
    try{
        let result = await noticeDao.updateCount(id, ++noticeCount);
        console.log(`nurbanboard detail updateCount result : ${result}`);  
    }catch(err){
        console.log(`nurbanboard detail updateCount err : ${err}`);
    }

})

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
        let result = noticeDao.read(offset, limit);
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

module.exports = router;