var express = require('express');
var router = express.Router();
const noticeDislikeDao = require('../dbdao/noticedislikedao');
const noticeLikeDao = require('../dbdao/noticelikedao');
const noticeDao = require('../dbdao/noticedao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let inputErrorHandler = require('../utils/inputerrorhandler');

// 싫어요 생성
router.post('/', async (req, res) => {
    let noticeId = req.body.noticeId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [noticeId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
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
    await noticeDislikeDao.destoryUserId(noticeId, userId);
    // 좋아요를 삭제하는 코드
    await noticeLikeDao.destoryUserId(noticeId, userId);

    // 싫어요를 생성하는 코드
    let noticeDislikeResult;
    try{
        noticeDislikeResult = await noticeDislikeDao.create(noticeId, userId);
    }catch(err){
        console.log(`post create result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 기사의 싫어요 카운터 수 가져오기
    let dislikeCount = -1
    try{
        let result = await noticeDislikeDao.readCount(noticeId);
        console.log(result.dataValues.n_ids)
        dislikeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 기사의 좋아요 카우터 수 가져오기
    let likeCount = -1
    try{
        let result = await noticeLikeDao.readCount(noticeId);
        console.log(result.dataValues.n_ids)
        likeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 너반꿀 게시판 테이블에 disLikeCount 증가하는 코드
    try{
        if(dislikeCount !== -1){
            let result = await noticeDao.updateDislikeCount(noticeId, dislikeCount);
        }  
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }

    // 너반꿀 게시판 테이블에 likeCount 증가하는 코드
    try{
        if(likeCount !== -1){
            let result = await noticeDao.updateLikeCount(noticeId, likeCount);
        }        
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }

    try{
        if(noticeDislikeResult !== null && noticeDislikeResult !== undefined){
            // 생성 성공

            // 너반꿀 게시판 db에서 좋아요 싫어요 수 가져오기
            let noticeResult = await noticeDao.readForId(noticeId);

            let likeCount = noticeResult.likeCount;
            let dislikeCount = noticeResult.dislikeCount;
        
            let nameList = ["likeCount", "dislikeCount"];
            let valueList = [likeCount, dislikeCount];
            resultObject = createJson.multi(nameList, valueList);
            res.status(201).json(resultObject);
        }else{
            // 생성 실패
            resultObject = createJson.result(0);
            res.status(400).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

// 싫어요 삭제
router.delete('/', async (req, res) => {
    let noticeId = req.query.noticeId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [noticeId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
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

    let noticeDislikeResult;
    try{
        noticeDislikeResult = await noticeDislikeDao.destoryUserId(noticeId, userId);
        // result 1이면 성공 0이면 실패
    }catch(err){
        console.log(`delete err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 기사의 싫어요 카운터 수 가져오기
    let dislikeCount = -1
    try{
        let result = await noticeDislikeDao.readCount(noticeId);
        //console.log(result.dataValues.n_ids)
        dislikeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);   
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }

    // 기사의 좋아요 카우터 수 가져오기
    let likeCount = -1
    try{
        let result = await noticeLikeDao.readCount(noticeId);
        console.log(result.dataValues.n_ids)
        likeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 너반꿀 게시판 테이블에 disLikeCount 증가하는 코드
    try{
        if(dislikeCount !== -1){
            let result = await noticeDao.updateDislikeCount(noticeId, dislikeCount);
        }        
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }

    // 너반꿀 게시판 테이블에 likeCount 증가하는 코드
    try{
        if(likeCount !== -1){
            let result = await noticeDao.updateLikeCount(noticeId, likeCount);
        }        
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }
    
    try{
        if(noticeDislikeResult === 1){
            // 싫어요 삭제 성공

            // 너반꿀 게시판 db에서 좋아요 싫어요 수 가져오기
            let noticeResult = await noticeDao.readForId(noticeId);
            
            let likeCount = noticeResult.likeCount;
            let dislikeCount = noticeResult.dislikeCount;
        
            let nameList = ["likeCount", "dislikeCount"];
            let valueList = [likeCount, dislikeCount];
            resultObject = createJson.multi(nameList, valueList);
            res.status(200).json(resultObject);
        }else{
            // 싫어요 삭제 실패
            resultObject = createJson.result(0);
            res.status(400).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

module.exports = router;