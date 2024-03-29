var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
const constObj = require('../config/const');
let getInsigniaShown = require('../utils/getinsigniashown');



const totalBoardDao = require('../dbdao/totalboarddao');

// 인기 게시판 통신
// 인기 게시판 리스트 받는 통신
router.get('/', async (req, res) => {
    let articleId = req.query.articleId;
    let limit = req.query.limit;

    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        /// TODO : readPopular 이거 아티클 아래로 바꿔야 된다..
        // 너반꿀 게시판에서 내가 쓴 글 불러오기
        //let nurbanBoardResult = await nurbanBoardDao.readPopular(offset, limit);
        //console.log("nurbanBoardResult", nurbanBoardResult);
        // TODO 자유게시판 내가 쓴 글 불러오기
        //let freeBoardResult = await freeBoardDao.readPopular(offset, limit);
        //console.log("freeBoardResult", freeBoardResult);

        let totalBoardResult = await totalBoardDao.readPopular(articleId, limit);
        console.log("totalBoardResult", totalBoardResult);

        let contentObjectList = [];

        // 너반꿀 게시판
        //for(var i = 0 ; i < nurbanBoardResult.length ; i++){
        //    nurbanBoardResult[i].dataValues.board = constObj.nurbanboard;
        //    nurbanBoardResult[i].dataValues.user.dataValues.insignia = await getInsigniaShown(nurbanBoardResult[i].dataValues.user.dataValues.userId);
        //    contentObjectList.push(nurbanBoardResult[i].dataValues);
        //}

        // 자유게시판 
        //for(var i = 0 ; i < freeBoardResult.length ; i++){
        //    freeBoardResult[i].dataValues.board = constObj.freeboard;
        //    freeBoardResult[i].dataValues.user.dataValues.insignia = await getInsigniaShown(freeBoardResult[i].dataValues.user.dataValues.userId);
        //    contentObjectList.push(freeBoardResult[i].dataValues);
        //}
        
        for(var i = 0 ; i < totalBoardResult.length ; i++){
            totalBoardResult[i].dataValues.user.dataValues.insignia = await getInsigniaShown(totalBoardResult[i].dataValues.user.dataValues.userId);
            contentObjectList.push(totalBoardResult[i].dataValues);
        }

        // array sort 내림차순(최신께 위로)
        //contentObjectList.sort((a, b) => {
        //    if(a.count > b.count) return -1;
        //    if(a.count === b.count) return 0;
        //    if(a.count < b.count) return 1;
        //});

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

module.exports = router;