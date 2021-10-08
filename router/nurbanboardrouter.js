var express = require('express');
var router = express.Router();
const nurbanboardDao = require('../dbdao/nurbanboarddao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');

/*
exports.create = function create(thumbnail, title, content, userId){
    return NurbanBoard.create({
        id: 0,
        thumbnail: thumbnail,
        title: title,
        content: content,
        userId: userId
    })
*/

// 글 생성 
router.post('/create', async (req, res) => {
    // TODO : thumbnail 처리 해야 됨.
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let content = req.body.content;
    let userId = '';

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObejct = new Object();
    // key 값으로 User 테이블의 id 값 받아오기
    await userDao.read(key)
    .then((result) => {
        userId = result.id;
    }).catch((err) => {
        console.log(`create userDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(resultObject);
    });

    // 너반꿀 게시판 글 작성
    await nurbanboardDao.create(thumbnail, title, content, userId)
    .then((result) => {
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(resultObject);
    }).catch((err) => {
        console.log(`create nurbanboardDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(resultObject);
    });
});

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (res, req) => {
    let id = res.query.id;
    
    // id 값으로 데이터 읽기
    await nurbanboardDao.readForId(id)
    .then((result) => {
        let id = result.id;
        let thumbanil = result.thumbanil;
        let title = result.title;
        let content = result.content;
        let count = result.cout;
        let commentCount = result.commentCount;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updateAt = result.updateAt; 
        
        let resultObject = {};
        let nameList = ["id", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", "error"];
        let valueList = [id, thumbanil, title, content, count, commentCount, likeCount, dislikeCount, updateAt, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObejct);
        res.json(resultObject);
    })
    .catch((err) => {
        let resultObject = {};
        let nameList = ["id", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, "article is not exist"];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObejct);
        res.json(resultObject);
    })
})

// 글 리스트 데이터 받아오는 메소드
router.get('/list', async(res, req) => {
    let offset = req.query.offset;
    // 썸네일, 제목, 댓글 개수
    /*
    var aJsonArray = new Array();
    var aJson = new Object();

    aJson.korName = "1";
    aJson.engName = "shoveIMan";
    
    aJsonArray.push(aJson);

    aJson.korName = "2";
    aJson.engName = "sapMan";
    
    aJsonArray.push(aJson);
    var sJson = JSON.stringify(aJsonArray);
    */
    
    await nurbanboardDao.readCount(offset)
    .then((result) => {
        console.log(`result.count : ${result.count}`);
        console.log(`result.rows : ${result.rows}`);
        
    })
    .catch((err) => {
        console.log(`err : ${err}`);
    })
   
    
});

module.exports = router;