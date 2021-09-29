var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
const appversionDao = require('./dbdao/appversiondao');
//const Users = require('./models/Users');

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

app.get('/appversion', (req, res) =>{
    let appversion = await appversionDao.read()

    appversion.then((result) => {
        console.log(result);
    });
    appversion.catch((err) => {
        console.log(err);
    });
});

app.post('/appversion/create', (req, res) =>{
    let body = req.body
    let appversionCreate = await appversionDao.create(body.appversion, body.isUpdate)
    appversionCreate.then((result) => {
        console.log(result);
    });
    appversionCreate.catch((err) => {
        console.log(err);
    });

});

app.listen(3000, function(){
    console.log('Example app listening on port 3000!')
});