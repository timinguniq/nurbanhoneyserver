var express = require('express');
var router = express.Router();
const appversionDao = require('../dbdao/appversiondao');
var createJson = require('../utils/createjson');

router.get('/', async (req, res) =>{
    let app = req.query.app;
    console.log(`app : ${app}`)
    let appversionObject = new Object();
    if(app === 'nurbanhoney'){
        await appversionDao.read()
        .then((result) => {
            console.log(result)
            let nameList = ["appversion", "isUpdate", "error"];
            let valueList = [result.dataValues.appversion, result.dataValues.isUpdate, null];
            appversionObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("appversion_result", appversionObject);
            res.json(JSON.stringify(resultObject));
        }).catch((err) => {
            console.log(err);
            let nameList = ["appversion", "isUpdate", "error"];
            let valueList = [null, null, err];
            appversionObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("appversion_result", appversionObject);
            res.json(JSON.stringify(resultObject));
        });
    }else{
        let nameList = ["appversion", "isUpdate", "error"];
        let valueList = [null, null, "app name error"];
        appversionObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("appversion_result", appversionObject);
        res.json(JSON.stringify(resultObject));
    }    
});

router.post('/create', async (req, res) =>{
    let body = req.body
    let appversionCreateObject = new Object();

    await appversionDao.create(body.appversion, body.isUpdate)
    .then((result) => {
        console.log(result);
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        appversionCreateObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one([appversion_create_result], appversionCreateObject);
        res.json(JSON.stringify(resultObject));
    }).catch((err) => {
        console.log(err);
        let nameList = ["result", "error"];
        let valueList = [null, err];
        appversionCreateObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("appversion_create_result", appversionCreateObject);
        res.json(JSON.stringify(resultObject));
    });
});

module.exports = router;