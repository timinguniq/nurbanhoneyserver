var express = require('express');
var router = express.Router();
const appversionDao = require('../dbdao/appversiondao');
var createJson = require('../utils/createjson');
var inputErrorHandler = require('../utils/inputerrorhandler');

router.get('/', async (req, res) => {
    let app = req.query.app;
    console.log(`app : ${app}`)
    let inputArray = [app];

    let resultObject = new Object

    // 필수 input 값이 null이거나 undefined면 에러
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    if(app === 'nurbanhoney'){
        try{
            // DB에서 데이터 읽기
            const result = await appversionDao.read()
            console.log(`result : ${result}`)
            if(result === null){
                resultObject = createJson.error("db is null");   
                res.status(501).json(resultObject);    
            }else{
                let nameList = ["appversion", "isUpdate"];
                let valueList = [result.dataValues.appversion, result.dataValues.isUpdate];
                resultObject = createJson.multi(nameList, valueList);
                res.status(200).json(resultObject);  
            }
        }catch(err){
            console.log(err);
            resultObject = createJson.error(err);
            res.status(500).json(resultObject);  
        }
    }else{
        resultObject = createJson.error("app name error");
        res.status(400).json(resultObject);  
    }
});

router.post('/create', async (req, res) =>{
    let body = req.body
    let appversionCreateObject = new Object();
    let resultObject = new Object();
    try{
        // appversion 생성
        const result = await appversionDao.create(body.appversion, body.isUpdate);
        console.log(result);
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        appversionCreateObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one([appversion_create_result], appversionCreateObject);
    }catch(err){
        console.log(err);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        appversionCreateObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("appversion_create_result", appversionCreateObject);
    }
    res.json(resultObject);
});

module.exports = router;