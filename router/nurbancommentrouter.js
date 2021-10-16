const { application } = require('express');
var express = require('express');
var router = express.Router();
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');


// 댓글 생성
router.post('/', async (req, res) => {
    let content = req.body.content;
    let userId = '';
    let articleId = req.body.articleId;
    let commentCount = 0;

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    // userId 추출하기
    try{
        let result = await userDao.read(key);
        console.log(`post result : ${result}`);
        userId = result.id
        commentCount = result.commentCount;
    }catch(err){
        console.log(`post error : ${error}`);
    }
    
    let contentObject = new Object();
    let resultObject = new Object();
    
    // 댓글 생성하는 코드
    try{
        let result = await nurbanCommentDao.create(content, articleId, userId);
        console.log(`post create result : ${result}`);
        let nameList = ["result", "error"];
        let valueList = [result, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbancomment_create_result", contentObject);
    }catch(err){
        console.log(`post create result err : ${err}`);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbancomment_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 테이블에 commentCount 증가하는 코드
    try{
        console.log(`commentCount : ${commentCount}`);
        let result = await nurbanBoardDao.updateCommentCount(articleId, commentCount)
        console.log(`commentCount result : ${result}`)    
    }catch(err){
        console.log(`post create comment update result err : ${err}`);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbancomment_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }
    res.json(resultObject);
});


// 댓글 리스트 읽기
router.get('/', async (req, res) => {

});



module.exports = router;