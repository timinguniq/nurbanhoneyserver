var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
const appversionDao = require('./dbdao/appversiondao');
var appversionRouter = require('./router/appversionrouter');
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

// appversion rounter
app.use('/appversion', appversionRouter)

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});