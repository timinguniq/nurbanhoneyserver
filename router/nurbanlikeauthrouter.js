var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let inputErrorHandler = require('../utils/inputerrorhandler');
let extractArticleKey = require('../utils/extractarticlekey')
let raisePoint = require('../utils/raisepoint');
let dropPoint = require('../utils/droppoint');
let constObj = require('../config/const');
let isApproveLossCut = require('../utils/isapprovelosscut');
let raiseTotalLossCut = require('../utils/raisetotallosscut');
let dropTotalLossCut = require('../utils/droptotallosscut');
let settingNurbanDislikeCount = require('../utils/settingnurbandislikecount');
let settingNurbanLikeCount = require('../utils/settingnurbanlikecount');

const totalDislikeDao = require('../dbdao/totaldislikedao');
const totalLikeDao = require('../dbdao/totallikedao');
const totalBoardDao = require('../dbdao/totalboarddao');

// 좋아요 생성
router.post('/', async (req, res) => {
    let articleId = req.body.articleId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
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

    if(userId === null){
        console.log("userId error")
    }
        
    // articleId로 작성자의 key값 가져오기
    let articleKey = await extractArticleKey(articleId);

    // 싫어요를 삭제하는 코드
    //await nurbanDislikeDao.destoryUserId(articleId, userId);
    await totalDislikeDao.destoryUserId(articleId, userId);
    // 좋아요를 삭제하는 코드
    //await nurbanLikeDao.destoryUserId(articleId, userId);
    await totalLikeDao.destoryUserId(articleId, userId);

    let nurbanLikeResult;
    // 좋아요를 생성하는 코드
    try{
        //nurbanLikeResult = await nurbanLikeDao.create(articleId, userId);
        nurbanLikeResult = await totalLikeDao.create(articleId, userId);
       
        // 좋아요 포인트를 추가하는 메소드
        if(!raisePoint(articleKey, constObj.likePoint)){
            console.log("raisePoint error");
        }

    }catch(err){
        console.log(`post create result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 싫어요 카운터 수 업데이트 하기
    await settingNurbanDislikeCount(articleId, resultObject, res);

    // 너반꿀 게시판 좋아요 카운터 수 업데이트 하기
    await settingNurbanLikeCount(articleId, resultObject, res);

    try{
        if(nurbanLikeResult !== null && nurbanLikeResult !== undefined){
            // 생성 성공

            // 너반꿀 게시판 db에서 좋아요 싫어요 수 가져오기
            //let nurbanBoardResult = await nurbanBoardDao.readForId(articleId);
            let nurbanBoardResult = await totalBoardDao.readForId(articleId);
            let likeCount = nurbanBoardResult.dataValues.likeCount;

            let reflectLossCut = nurbanBoardResult.reflectLossCut;
            if(!reflectLossCut){
                if(isApproveLossCut(articleId)){
                    //await nurbanBoardDao.updateReflectLossCut(articleId, true);
                    await totalBoardDao.updateReflectLossCut(articleId, true);

                    if(raiseTotalLossCut(articleKey, articleId)){
                        console.log("raiseTotalLossCut error");
                    }
                }
            }
            // likeCount return
            resultObject = createJson.result(likeCount);
            res.status(201).json(resultObject);
        }else{
            // 생성 실패
            resultObject = createJson.result("nurbanhoard_like_posted_fail");
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
    let articleId = req.body.articleId;
    let userId = "";

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [articleId];
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

    if(userId === null){
        console.log("userId error")
    }  

    // articleId로 작성자의 key값 가져오기
    let articleKey = await extractArticleKey(articleId);

    let nurbanLikeResult;
    try{
        //nurbanLikeResult = await nurbanLikeDao.destoryUserId(articleId, userId);
        nurbanLikeResult = await totalLikeDao.destoryUserId(articleId, userId);
        // result 1이면 성공 0이면 실패

        // 싫어요 포인트를 삭제하는 메소드
        if(!dropPoint(articleKey, constObj.likePoint)){
            console.log("dropPoint error");
        }
    }catch(err){
        console.log(`delete err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 싫어요 카운터 수 업데이트 하기
    await settingNurbanDislikeCount(articleId, resultObject, res);

    // 너반꿀 게시판 좋아요 카운터 수 업데이트 하기
    await settingNurbanLikeCount(articleId, resultObject, res);

    try{
        if(nurbanLikeResult === 1){
            // 좋아요 삭제 성공

            // 너반꿀 게시판 db에서 좋아요 싫어요 수 가져오기
            //let nurbanBoardResult = await nurbanBoardDao.readForId(articleId);
            let nurbanBoardResult = await totalBoardDao.readForId(articleId);
            let likeCount = nurbanBoardResult.dataValues.likeCount;

            let reflectLossCut = nurbanBoardResult.reflectLossCut;
            if(reflectLossCut){
                if(!isApproveLossCut(articleId)){
                    //await nurbanBoardDao.updateReflectLossCut(articleId, false);
                    await totalBoardDao.updateReflectLossCut(articleId, false);

                    if(dropTotalLossCut(articleKey, articleId)){
                        console.log("dropTotalLossCut error");
                    }
                }
            }

            resultObject = createJson.result(likeCount);
            res.status(200).json(resultObject);
        }else{
            // 싫어요 삭제 실패
            resultObject = createJson.result("nurbanboard_like_deleted_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

module.exports = router;