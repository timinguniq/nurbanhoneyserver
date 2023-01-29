var express = require('express');
var router = express.Router();
const freeCommentDao = require('../dbdao/freecommentdao');
const freeBoardDao = require('../dbdao/freeboarddao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let inputErrorHandler = require('../utils/inputerrorhandler');
let raisePoint = require('../utils/raisepoint');
let dropPoint = require('../utils/droppoint');
let constObj = require('../config/const');

// 토큰이 있어야 가능한 통신

// 댓글 생성
router.post('/', async (req, res) => {
    let content = req.body.content;
    let userId = '';
    let articleId = req.body.articleId;
    let commentCount = 0;

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [content, articleId];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }
    
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // 키값으로 userId 값 얻어내기 
    userId = await extractUserId(key);

    if(userId === ""){
        console.log(`user Id error`);
    }

    // commentCount 추출하기
    try{
        let result = await freeBoardDao.readForId(articleId);
        console.log(`post result freeBoardDao : ${JSON.stringify(result)}`);
        commentCount = result.commentCount;
    }catch(err){
        console.log(`post error freeBoardDao : ${err}`);    
    }
    
    // 댓글 생성하는 코드
    try{
        let result = await freeCommentDao.create(content, articleId, userId);
        console.log(`post create result : ${result}`);

        // 포인트를 올리는 메소드
        if(!raisePoint(key, constObj.writeCommentPoint)){
            console.log("raisePoint error");
        }

        resultObject = createJson.result("freecomment_posted");
        res.status(201).json(resultObject);
    }catch(err){
        console.log(`post create result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 테이블에 commentCount 증가하는 코드
    try{
        console.log(`commentCount : ${commentCount}`);
        let result = await freeBoardDao.updateCommentCount(articleId, ++commentCount)
        console.log(`commentCount result : ${result}`)    
    }catch(err){
        console.log(`post create comment update result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

// 댓글 수정
router.patch('/', async (req, res) => {
    let id = req.body.id;
    let content = req.body.content;
    
    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id, content];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    try{
        let result = await freeCommentDao.updateContent(id, content);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        if(result[0] === 1){
            resultObject = createJson.result("freecomment_updated");
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("freecomment_updated_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        console.log(`patch err : ${result}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 댓글 삭제
router.delete('/', async (req, res) => {
    let id = req.body.id;
    let articleId = req.body.articleId;
    let commentCount = 0;

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }
   
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // commentCount 추출하기
    try{
        let result = await freeBoardDao.readForId(articleId);
        console.log(`post result freeBoardDao : ${JSON.stringify(result)}`);
        commentCount = result.commentCount;
    }catch(err){
        console.log(`post error freeBoardDao : ${err}`);    
    }

    try{
        let result = await freeCommentDao.destory(id);
        // result 1이면 성공 0이면 실패
        console.log(`delete result : ${result}`)

        // 포인트를 내리는 메소드
        if(!dropPoint(key, constObj.writeCommentPoint)){
            console.log("dropPoint error");
        }

        if(result === 1){
            resultObject = createJson.result("freecomment_deleted");
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("freecomment_deleted_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        console.log(`delete err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 테이블에 commentCount 감소하는 코드
    try{
        console.log(`commentCount : ${commentCount}`);

        if(commentCount >= 1){
            let result = await freeBoardDao.updateCommentCount(articleId, --commentCount)
            console.log(`commentCount result : ${result}`)     
        }           
    }catch(err){
        console.log(`post create comment update result err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();
    }
});

module.exports = router;