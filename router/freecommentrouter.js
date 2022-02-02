var express = require('express');
var router = express.Router();
const freeCommentDao = require('../dbdao/freecommentdao');
const freeBoardDao = require('../dbdao/freeboarddao');
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
        let result = await freeCommentDao.readCount(articleId, offset, limit);
 
        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            // string으로 안 가고 array로 가게 수정하는 코드
            result[i].dataValues.User.dataValues.insignia = JSON.parse(result[i].dataValues.User.dataValues.insignia);
            if(result[i].dataValues.User.dataValues.insignia === ""){
                result[i].dataValues.User.dataValues.insignia = [];
            }
            //

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
        let result = await freeBoardDao.readForId(articleId);
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
        let result = await freeCommentDao.read(commentId);
        
        // string으로 안 가고 array로 가게 수정하는 코드
        result.dataValues.User.dataValues.insignia = JSON.parse(result.dataValues.User.dataValues.insignia);
        if(result.dataValues.User.dataValues.insignia === ""){
            result.dataValues.User.dataValues.insignia = [];
        }
        //

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