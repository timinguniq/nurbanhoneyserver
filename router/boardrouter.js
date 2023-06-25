var express = require('express');
var router = express.Router();
const boardDao = require('../dbdao/boarddao');
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
let constObj = require('../config/const');

const totalBoardDao = require('../dbdao/totalboarddao');

// 공지사항 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let resultObject = new Object();

    try{
        let result = await boardDao.read();
        console.log("result", result);

        let contentObjectList = [];

        for(var i = 0 ; i < result.length ; i++){
            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        //console.log(`result.rows : ${result.rows}`);
        //resultObject = createJson.one("nurbanboard_list_result", contentObjectList);
        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 게시판의 모든 데이터 받아오는 메소드
router.get('/all', async (req, res) => {
    let articleId = req.query.articleId;
    let flag = req.query.flag;
    let limit = req.query.limit;    

    let contentObject = new Object();
    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [flag];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        let result;
        let iFlag = Number(flag);
        if(iFlag === constObj.defaultOrder){
            //result = await nurbanBoardDao.read(articleId, limit);
            result = await totalBoardDao.readBoardAll(articleId, limit);
        }else if(iFlag === constObj.countOrder){
            //result = await nurbanBoardDao.readCount(articleId, limit);
            result = await totalBoardDao.readCountBoardAll(articleId, limit);
        }else if(iFlag === constObj.likeCountOrder){
            //result = await nurbanBoardDao.readLikeCount(articleId, limit);
            result = await totalBoardDao.readLikeCountBoardAll(articleId, limit);
        }else{
            // 에러
            resultObject = createJson.error("flag is not correct");
            res.status(400).json(resultObject);
            return res.end()
        }
        console.log("result", result);

        let contentObjectList = [];
        let insigniaList = [];

        for(var i = 0 ; i < result.length ; i++){
            console.log("result user ", result[i].dataValues.user.dataValues);

            insigniaList = await getInsigniaShown(result[i].dataValues.user.dataValues.userId);

            result[i].dataValues.user.dataValues.insignia = insigniaList
            //
            contentObjectList.push(result[i].dataValues);
            
            insigniaList = [];
        }

        console.log("contentObjectArrayList", contentObjectList);
        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

module.exports = router;