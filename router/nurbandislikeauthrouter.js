var express = require('express');
var router = express.Router();
const nurbanDislikeDao = require('../dbdao/nurbandislikedao');
const nurbanLikeDao = require('../dbdao/nurbanlikedao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractUserId');
let inputErrorHandler = require('../utils/inputerrorhandler');

// 싫어요 생성
router.post('/', async (req, res) => {
    let articleId = req.body.articleId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // 키값으로 userId값 가져오기
    userId = await extractUserId(key);

    if(userId === ""){
        console.log("userId error")
    }
        
    // 싫어요를 삭제하는 코드
    await nurbanDislikeDao.destoryUserId(articleId, userId);
    // 좋아요를 삭제하는 코드
    await nurbanLikeDao.destoryUserId(articleId, userId);

    // 싫어요를 생성하는 코드
    try{
        let result = await nurbanDislikeDao.create(articleId, userId);
        console.log(`post create result : ${result}`);
        let nameList = ["result", "error"];
        let valueList = [result, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_create_result", contentObject);
    }catch(err){
        console.log(`post create result err : ${err}`);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 기사의 싫어요 카운터 수 가져오기
    let dislikeCount = -1
    try{
        let result = await nurbanDislikeDao.readCount(articleId);
        console.log(result.dataValues.n_ids)
        dislikeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 기사의 좋아요 카우터 수 가져오기
    let likeCount = -1
    try{
        let result = await nurbanLikeDao.readCount(articleId);
        console.log(result.dataValues.n_ids)
        likeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 너반꿀 게시판 테이블에 disLikeCount 증가하는 코드
    try{
        if(dislikeCount !== -1){
            let result = await nurbanBoardDao.updateDislikeCount(articleId, dislikeCount);
        }        
    }catch(err){
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_create_result", contentObject);
        res.json(resultObject);
        return res.end();   
    }

    // 너반꿀 게시판 테이블에 likeCount 증가하는 코드
    try{
        if(likeCount !== -1){
            let result = await nurbanBoardDao.updateLikeCount(articleId, likeCount);
        }        
    }catch(err){
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_create_result", contentObject);
        res.json(resultObject);
        return res.end();   
    }

    res.json(resultObject);
});

// 싫어요 삭제
router.delete('/', async (req, res) => {
    let articleId = req.query.articleId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // 키값으로 userId값 가져오기
    userId = await extractUserId(key);

    if(userId === ""){
        console.log("userId error")
    }

    try{
        let result = await nurbanDislikeDao.destoryUserId(articleId, userId);
        // result 1이면 성공 0이면 실패
        console.log(`delete result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_delete_result", contentObject);
    }catch(err){
        console.log(`delete err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 기사의 싫어요 카운터 수 가져오기
    let dislikeCount = -1
    try{
        let result = await nurbanDislikeDao.readCount(articleId);
        //console.log(result.dataValues.n_ids)
        dislikeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_delete_result", contentObject);
        res.json(resultObject);
        return res.end();   
    }

    // 너반꿀 게시판 테이블에 disLikeCount 감소하는 코드
    try{
        if(dislikeCount !== -1){
            let result = await nurbanBoardDao.updateDislikeCount(articleId, dislikeCount);
        }
    }catch(err){
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbandislike_delete_result", contentObject);
        res.json(resultObject);
        return res.end();   
    }

    res.json(resultObject);
});

module.exports = router;