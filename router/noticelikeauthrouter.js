var express = require('express');
var router = express.Router();
const noticeDislikeDao = require('../dbdao/noticedislikedao');
const noticeLikeDao = require('../dbdao/noticelikedao');
const noticeDao = require('../dbdao/noticedao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let inputErrorHandler = require('../utils/inputerrorhandler');
let settingNoticeDislikeCount = require('../utils/settingnoticedislikecount');
let settingNoticeLikeCount = require('../utils/settingnoticelikecount');

// 좋아요 생성
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

    let token = req.headers.authorization?.replace('Bearer ', '');
    
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

    let noticeLikeResult;
    // 좋아요를 생성하는 코드
    try{
        noticeLikeResult = await noticeLikeDao.create(noticeId, userId);
    }catch(err){
        console.log(`post create result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 공지사항의 싫어요 카운터 수 업데이트 하기
    await settingNoticeDislikeCount(noticeId, resultObject, res);

    // 공지사항의 좋아요 카운터 수 업데이트 하기
    await settingNoticeLikeCount(noticeId, resultObject, res);

    try{
        if(noticeLikeResult !== null && noticeLikeResult !== undefined){
            // 생성 성공
            resultObject = createJson.result("notice_like_posted");
            res.status(201).json(resultObject);
        }else{
            // 생성 실패
            resultObject = createJson.result("notice_like_posted_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }    
});

// 좋아요 삭제
router.delete('/', async (req, res) => {
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

    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // 키값으로 userId값 가져오기
    userId = await extractUserId(key);

    if(userId === ""){
        console.log("userId error")
    }  

    let noticeLikeResult;
    try{
        noticeLikeResult = await noticeLikeDao.destoryUserId(noticeId, userId);
        // result 1이면 성공 0이면 실패

    }catch(err){
        console.log(`delete err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 공지사항의 싫어요 카운터 수 업데이트 하기
    await settingNoticeDislikeCount(noticeId, resultObject, res);

    // 공지사항의 좋아요 카운터 수 업데이트 하기
    await settingNoticeLikeCount(noticeId, resultObject, res);

    try{
        if(noticeLikeResult === 1){
            // 좋아요 삭제 성공

            resultObject = createJson.result("notice_like_deleted");
            res.status(200).json(resultObject);
        }else{
            // 싫어요 삭제 실패
            resultObject = createJson.result("notice_like_deleted_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

module.exports = router;