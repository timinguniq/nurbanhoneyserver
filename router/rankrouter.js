var express = require('express');
var router = express.Router();
const rankDao = require('../dbdao/rankdao');
var createJson = require('../utils/createjson');
let getInsigniaShown = require('../utils/getinsigniashown');

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
            result[i].dataValues.user.dataValues.insignia = await getInsigniaShown(result[i].dataValues.user.dataValues.userId);

            contentObjectList.push(result[i].dataValues);
        }

        console.log("contentObjectArrayList", contentObjectList);

        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 팝업 랭킹 데터 받아오는 통신
router.get('/popup', async (req, res) => {
    let offset = req.query.offset;
    let limit = req.query.limit;

    let contentObject = new Object();
    let resultObject = new Object();

    // 썸네일, 제목, 댓글 개수
    try{
        let result = await rankDao.readPopup(offset, limit);
        console.log("result", result);

        let contentObjectList = [];
 
        for(var i = 0 ; i < result.length ; i++){
            result[i].dataValues.user.dataValues.insignia = await getInsigniaShown(result[i].dataValues.user.dataValues.userId);

            contentObjectList.push(result[i].dataValues);
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