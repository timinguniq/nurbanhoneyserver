var express = require('express');
var router = express.Router();
const informationDao = require('../dbdao/informationdao');
var createJson = require('../utils/createjson');
let inputErrorHandler = require('../utils/inputerrorhandler');
let constObj = require('../config/const');
let getInsigniaShown = require('../utils/getinsigniashown');

// 이용약관 데이터 받는 통신
router.get('/terms', async (req, res) => {
    let resultObject = new Object();
    
    try{
        let result = await informationDao.readForFlag(0);
        console.log("result", result);
        
        resultObject = createJson.one("result", result.dataValues.content);
        res.status(200).json(resultObject);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 개인정보 처리방침 데이터 받는 통신
router.get('/privacy', async (req, res) => {
    let resultObject = new Object();

    try{
        let result = await informationDao.readForFlag(1);
        console.log("result", result);
        
        resultObject = createJson.one("result", result.dataValues.content);
        res.status(200).json(resultObject);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});


module.exports = router;