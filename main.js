var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
var createJson = require('./utils/createjson');
var appversionRouter = require('./router/appversionrouter');
var loginRouter = require('./router/loginrouter');
var isValidToken = require('./utils/isvalidtoken');
var tokenRouter = require('./router/tokenrouter');
var nurbanboardRouter = require('./router/nurbanboardrouter');

app.use(bodyParser.urlencoded({ extended: false}));
// x-www-form-urlencoded를 파싱하기 위해서 아래를 확장해야 한다.
app.use(express.urlencoded({
    extended: true
}));

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
app.use('/appversion', appversionRouter);

// user router
app.use('/login', loginRouter);

// token valid
app.use('/', tokenRouter);

// 테스트 코드
app.get('/login/test', (req, res) => {
  let token = req.headers.token;
  console.log(`token : ${token}`);
  res.send(`token : ${token}`)
});

// nurbanboard router
app.use('/nurbanboard', nurbanboardRouter);

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});