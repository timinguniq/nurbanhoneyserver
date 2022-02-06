var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
const freeBoardDao = require('../dbdao/freeboarddao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let settingBadge = require('../utils/settingbadge');
let settingInsignia = require('../utils/settinginsignia');
let inputErrorHandler = require('../utils/inputerrorhandler');
const constObj = require('../config/const');

// 인기 게시판 통신
// 인기 게시판 리스트 받는 통신
router.get('/', async (req, res) => {
    let offset = req.query.offset;
    let limit = req.query.limit; 

    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [offset, limit];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        // 너반꿀 게시판에서 내가 쓴 글 불러오기
        let nurbanBoardResult = await nurbanBoardDao.readPopular(offset, limit);
        console.log("nurbanBoardResult", nurbanBoardResult);
        // TODO 자유게시판 내가 쓴 글 불러오기
        let freeBoardResult = await freeBoardDao.readPopular(offset, limit);
        //console.log("freeBoardResult", freeBoardResult);

        let contentObjectList = [];

        // 너반꿀 게시판
        for(var i = 0 ; i < nurbanBoardResult.length ; i++){
            nurbanBoardResult[i].dataValues.board = constObj.nurbanboard;
            // string으로 안 가고 array로 가게 수정하는 코드
            nurbanBoardResult[i].dataValues.User.dataValues.insignia = JSON.parse(nurbanBoardResult[i].dataValues.User.dataValues.insignia);
            if(nurbanBoardResult[i].dataValues.User.dataValues.insignia === ""){
                nurbanBoardResult[i].dataValues.User.dataValues.insignia = [];
            }
            //
            contentObjectList.push(nurbanBoardResult[i].dataValues);
        }

        // 자유게시판 
        for(var i = 0 ; i < freeBoardResult.length ; i++){
            freeBoardResult[i].dataValues.board = constObj.freeboard;
            // string으로 안 가고 array로 가게 수정하는 코드
            freeBoardResult[i].dataValues.User.dataValues.insignia = JSON.parse(freeBoardResult[i].dataValues.User.dataValues.insignia);
            if(freeBoardResult[i].dataValues.User.dataValues.insignia === ""){
                freeBoardResult[i].dataValues.User.dataValues.insignia = [];
            }
            //
            contentObjectList.push(freeBoardResult[i].dataValues);
        }

        // array sort 내림차순(최신께 위로)
        contentObjectList.sort((a, b) => {
            if(a.count > b.count) return -1;
            if(a.count === b.count) return 0;
            if(a.count < b.count) return 1;
        });

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