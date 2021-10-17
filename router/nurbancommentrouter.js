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
        console.log(`post result : ${JSON.stringify(result)}`);
        userId = result.id
    }catch(err){
        console.log(`post error : ${err}`);
    }

    // commentCount 추출하기
    try{
        let result = await nurbanBoardDao.readForId(articleId);
        console.log(`post result nurbanBoardDao : ${JSON.stringify(result)}`);
        commentCount = result.commentCount;
    }catch(err){
        console.log(`post error nurbanBoardDao : ${err}`);    
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
        let result = await nurbanBoardDao.updateCommentCount(articleId, ++commentCount)
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
    let articleId = req.query.articleId
    let offset = req.query.offset;
    let limit = req.query.limit;

    let resultObject = new Object();

    // 컨텐츠, 글id, userId, profile, nickname, insignia
    try{
        let result = await nurbanCommentDao.readCount(articleId, offset, limit);
        // 데이터 베이스 총 카운터 수
        let contentTotalCount = result.count
        // 데이터 리스트 오브젝트        
        let contentObjectArray = result.rows;
 
        console.log(`result.rows : ${result.rows}`);
        resultObject = createJson.one("nurbancomment_list_result", contentObjectArray);
    }catch(err){
        console.log(`err : ${err}`);
        let contentObject = new Object();
        contentObject.error = err;
        resultObject = createJson.one("nurbancomment_list_result", contentObject);
    }
    res.json(resultObject);
});

// 댓글 수정
router.patch('/', async (req, res) => {
    let id = req.query.id;
    let content = req.query.content;
    
    try{
        let result = await nurbanCommentDao.updateContent(id, content);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbancomment_revise_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`patch err : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbancomment_revise_result", contentObject);
        res.json(resultObject);
    }
});

// 댓글 삭제
router.delete('/', async (req, res) => {
    let id = req.query.id;

    try{
        let result = await nurbanCommentDao.destory(id);
        // result 1이면 성공 0이면 실패
        console.log(`delete result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbancomment_delete_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`delete err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbancomment_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }
});



module.exports = router;