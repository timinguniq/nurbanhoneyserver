var express = require('express');
var router = express.Router();
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');

// 토큰이 없어도 통신이 가능

// 댓글 리스트 읽기
router.get('/', async (req, res) => {
    let articleId = req.query.articleId
    let offset = req.query.offset;
    let limit = req.query.limit;

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId, offset, limit];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 컨텐츠, 글id, userId, profile, nickname, insignia
    try{
        let result = await nurbanCommentDao.readCount(articleId, offset, limit);
 
        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            contentObjectList.push(result[i].dataValues);
        }
        res.status(200).json(contentObjectList)
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 댓글 갯수 얻는 통신
router.get('/count', async (req, res) => {
    let articleId = req.query.articleId;

    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    try{
        let result = await nurbanBoardDao.readForId(articleId);
        let commentCount = result.commentCount;

        resultObject = createJson.result(commentCount);
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("article is not exist");
        res.status(500).json(resultObject);
    }
});

module.exports = router;