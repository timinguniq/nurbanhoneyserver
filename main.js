var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
var appversionRouter = require('./router/appversionrouter');
var loginRouter = require('./router/loginrouter');
var isValidToken = require('./utils/isvalidtoken');

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
app.use((req, res, next) =>{
  // 나중에 테스트
  let token = req.headers.token;
  if(isValidToken(token)){
    // 토큰이 유효하다
    next();
  }else{
    // 토큰이 안 유효하다
    res.send("token not valid")
  }
});

// 테스트 코드
app.get('/login/test', (req, res) => {
  let token = req.headers.token;
  console.log(`token : ${token}`);
  res.send(`token : ${token}`)
});


app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});