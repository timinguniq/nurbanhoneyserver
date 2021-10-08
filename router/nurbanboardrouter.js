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

    let contentObject = new Object();
    // key 값으로 User 테이블의 id 값 받아오기
    await userDao.read(key)
    .then((result) => {
        userId = result.id;
    }).catch((err) => {
        console.log(`create userDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
        res.json(resultObject);
    });

    // 너반꿀 게시판 글 작성
    await nurbanboardDao.create(thumbnail, title, content, userId)
    .then((result) => {
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
        res.json(resultObject);
    }).catch((err) => {
        console.log(`create nurbanboardDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
        res.json(resultObject);
    });
});

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (req, res) => {
    let id = req.query.id;
    
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
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    })
    .catch((err) => {
        let resultObject = {};
        let nameList = ["id", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, "article is not exist"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    })
})

// 글 리스트 데이터 받아오는 메소드
router.get('/list', async (req, res) => {
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
    
    await nurbanboardDao.readCount(offset, limit)
    .then((result) => {
        // 데이터 베이스 총 카운터 수
        let contentTotalCount = result.count
        // 데이터 리스트 오브젝트        
        let contentObjectArray = result.rows;
        let resultObject = createJson.one("nurbanboard_list_result", contentObjectArray);
        res.json(resultObject);
    })
    .catch((err) => {
        console.log(`err : ${err}`);
        let contentObject = new Object();
        contentObject.error = err;
        let resultObject = createJson.one("nurbanboard_list_result", contentObject);
        res.json(resultObject);    
    })
   
    
});

module.exports = router;