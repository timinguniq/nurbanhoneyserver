var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
let getInsigniaShown = require('../utils/getinsigniashown');

const totalCommentDao = require('../dbdao/totalcommentdao');
const totalBoardDao = require('../dbdao/totalboarddao');

// 토큰이 없어도 통신이 가능

// 댓글 리스트 읽기
router.get('/', async (req, res) => {
    let articleId = req.query.articleId
    let commentId = req.query.commentId;
    let limit = req.query.limit;

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 컨텐츠, 글id, userId, profile, nickname, insignia
    try{
        //let result = await nurbanCommentDao.readCount(articleId, commentId, limit);
        let result = await totalCommentDao.readCount(articleId, commentId, limit);

        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            result[i].dataValues.user.dataValues.insignia = await getInsigniaShown(result[i].dataValues.user.dataValues.userId);

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
        //let result = await nurbanBoardDao.readForId(articleId);
        let result = await totalBoardDao.readForId(articleId);
        let commentCount = result.commentCount;

        resultObject = createJson.result(commentCount);
        res.status(200).json(resultObject);
    }catch(err){
        resultObject = createJson.error("article is not exist");
        res.status(500).json(resultObject);
    }
});

// 댓글 하나 가져오는 메소드
router.get('/detail', async (req, res) => {
    let commentId = req.query.commentId

    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [commentId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 컨텐츠, 글id, userId, profile, nickname, insignia
    try{
        //let result = await nurbanCommentDao.read(commentId);
        let result = await totalCommentDao.read(commentId);

        result.dataValues.user.dataValues.insignia = await getInsigniaShown(result.dataValues.user.dataValues.userId);

        if(result !== null){
            res.status(200).json(result.dataValues);
        }else{
            res.status(700).json("comment is not exist");
        }
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});


module.exports = router;