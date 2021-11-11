var express = require('express');
var router = express.Router();
const appversionDao = require('../dbdao/appversiondao');
var createJson = require('../utils/createjson');
var inputErrorHandler = require('../utils/inputerrorhandler');


router.get('/', async (req, res) => {
    let app = req.query.app;
    console.log(`app : ${app}`)
    let inputArray = [app];

    let appversionObject = new Object();
    let resultObject = new Object

    // 필수 input 값이 null이거나 undefined면 에러
    if(await inputErrorHandler(inputArray)){
        let nameList = ["error"];
        let valueList = ["input is null"];
        appversionObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("appversion_result", appversionObject); 
        res.json(appversionObject);
        return res.end();
    }

    if(app === 'nurbanhoney'){
        try{
            // DB에서 데이터 읽기
            const result = await appversionDao.read()
            console.log(`result : ${result}`)
            if(result === null){
                let nameList = ["appversion", "isUpdate", "error"];
                let valueList = [null, null, "db is null"];
                appversionObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("appversion_result", appversionObject);    
            }else{
                let nameList = ["appversion", "isUpdate", "error"];
                let valueList = [result.dataValues.appversion, result.dataValues.isUpdate, null];
                appversionObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("appversion_result", appversionObject);    
            }
        }catch(err){
            console.log(err);
            let nameList = ["error"];
            let valueList = [err];
            appversionObject = createJson.multi(nameList, valueList);
            resultObject = createJson.one("appversion_result", appversionObject);
        }
    }else{
        let nameList = ["error"];
        let valueList = ["app name error"];
        appversionObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("appversion_result", appversionObject);
    }
    res.json(appversionObject);    
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