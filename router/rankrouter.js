var express = require('express');
var router = express.Router();
const rankDao = require('../dbdao/rankdao');
const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
let settingBadge = require('../utils/settingbadge');
let settingInsignia = require('../utils/settinginsignia');
let inputErrorHandler = require('../utils/inputerrorhandler');

// 랭크 관련 통신

// 랭크 데이터 받아오는 통신
router.get('/', async (req, res) => {
    let contentObject = new Object();
    let resultObject = new Object();

    // 썸네일, 제목, 댓글 개수
    try{
        let result = await rankDao.read();
        console.log("result", result);

        let contentObjectList = [];
 
        for(var i = 0 ; i < result.length ; i++){
            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        res.json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        contentObject.error = err;
        resultObject = createJson.one("rank_list_result", contentObject);
        res.json(resultObject);
    }
});

module.exports = router;