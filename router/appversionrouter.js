var express = require('express');
var router = express.Router();

router.get('/', async (req, res) =>{
    let app = req.query.app
    console.log(`app : ${app}`)
    if(app === 'nurbanhoney'){
        await appversionDao.read()
        .then((result) => {
            console.log(result)
            let appversionObject = new Object();
            appversionObject.appversion = result.dataValues.appversion;
            appversionObject.isUpdate = result.dataValues.isUpdate;
            let resultObject = new Object();
            resultObject.appversion_result = appversionObject;
            res.json(JSON.stringify(resultObject));
        }).catch((err) => {
            console.log(err);
            let resultObject = new Object();
            resultObject.appversion_result = err;
            res.json(JSON.stringify(resultObject));
        });
    }else{
        let resultObject = new Object();
        resultObject.appversion_result = 'app name error';    
        res.json(JSON.stringify(resultObject));
    }    
});

router.post('/create', async (req, res) =>{
    let body = req.body
    await appversionDao.create(body.appversion, body.isUpdate)
    .then((result) => {
        console.log(result);
        let resultObject = new Object();
        resultObject.appversion_create_result = "ok";
        res.json(JSON.stringify(resultObject));
    }).catch((err) => {
        console.log(err);
        let resultObject = new Object();
        resultObject.appversion_create_result = err;
        res.json(JSON.stringify(resultObject));
    });
});

module.exports = router;