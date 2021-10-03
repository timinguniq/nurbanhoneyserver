var express = require('express');
var router = express.Router();
const nurbanboardDao = require('../dbdao/nurbanboarddao');
var createJson = require('../utils/createjson');
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
    let token = req.headers.token;
    
    let thumbanil = req.body.thumbnail;
    let title = req.body.title;
    let content = req.body.content;
    let userId = req.body.userId;

});

module.exports = router;