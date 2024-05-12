var express = require('express');
var router = express.Router();
const informationDao = require('../dbdao/informationdao');
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
let constObj = require('../config/const');
let getInsigniaShown = require('../utils/getinsigniashown');

// 이용약관 가져오는 데이터 받는 통신
router.get('/terms', async (req, res) => {
    let resultObject = new Object();

    try{
        let result = await informationDao.readForFlag(0);
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

module.exports = router;