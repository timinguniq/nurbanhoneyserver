var express = require('express');
var router = express.Router();
const nurbanboardDao = require('../dbdao/nurbanboarddao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');
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

    let decoded = jwt.verify(token, secretObj.secret);
    console.log(`decoded : ${decoded}`);
    let email = decoded.email;

    let contentObejct = new Object();

    await userDao.read(email)
    .then((result) => {
        userId = result.id;
    }).catch((err) => {
        console.log(`create userDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(JSON.stringify(resultObject));
    });

    await nurbanboardDao.create(thumbnail, title, content, userId)
    .then((result) => {
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(JSON.stringify(resultObject));
    }).catch((err) => {
        console.log(`create nurbanboardDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObejct);
        res.json(JSON.stringify(resultObject));
    });
});

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (res, req) => {
    let id = res.query.id;
    
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
        
    })
    .catch((err) => {

    })

})

module.exports = router;