var express = require('express');
var router = express.Router();
const boardDao = require('../dbdao/boarddao');
var createJson = require('../utils/createjson');

// 공지사항 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let resultObject = new Object();

    try{
        let result = boardDao.read();
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