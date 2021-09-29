var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
const appversionDao = require('./dbdao/appversiondao');
//const Users = require('./models/Users');

app.use(bodyParser.urlencoded({ extended: false}));

sequelize.sync({ force: false })
.then(() => {
  console.log('데이터베이스 연결 성공');
})
.catch((err) => {
  console.error(err);
});

app.get('/', (req, res) => {
    res.send('Hello world1')
});

app.get('/appversion', async (req, res) =>{
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

app.post('/appversion/create', async (req, res) =>{
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

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});