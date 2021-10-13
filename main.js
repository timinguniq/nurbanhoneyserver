var express = require('express');
const app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const { sequelize } = require('./models');
var createJson = require('./utils/createjson');
var appversionRouter = require('./router/appversionrouter');
var loginRouter = require('./router/loginrouter');
var tokenMidRouter = require('./router/tokenmidrouter');
var tokenRouter = require('./router/tokenrouter');
var nurbanboardRouter = require('./router/nurbanboardrouter');
const nurbanboardDao = require('./dbdao/nurbanboarddao');


// for parsing application/json
app.use(express.json());
// x-www-form-urlencoded를 파싱하기 위해서 아래를 확장해야 한다.
app.use(express.urlencoded({
    extended: true
}));
// for parsing multipart/form-data
app.use(upload.array('image')); 
app.use(express.static('public'));

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

// token_expire 테스트 코드
app.get('/token/error', (req, res) => {
  let resultObject = {};
  let tokenObject = new Object();
  tokenObject.error = "token_expired"
  resultObject = createJson.one("server_error", tokenObject);
  res.json(resultObject);
})

app.post('/token/error', (req, res) => {
  let resultObject = {};
  let tokenObject = new Object();
  tokenObject.error = "token_expired"
  resultObject = createJson.one("server_error", tokenObject);
  res.json(resultObject);
})
// 여기까지

// 임의의 데이터 값 넣는 통신
app.post('/nurbanboard/insertTempData', async (req, res) => {
  var dataList = [];
  for(let i = 1 ; i < 21 ; i++){
    var tempData = {
      'thumbnail' : null,
      'title' : String(i),
      'content' : String(i),
      'userId' : 1
    }
    dataList.push(tempData);
  }

  for(var ele in dataList){
    await nurbanboardDao.create(ele.thumbnail, ele, ele, 1)
    .then((result) => {
      console.log(`result : ${result}`);
    })
    .catch((err) => {
      console.log(`err : ${err}`);
    });
  }
  res.end()
})

// appversion rounter
app.use('/appversion', appversionRouter);
// user router
app.use('/login', loginRouter);
// token router
app.use('/token', tokenRouter);
// token valid
app.use('/', tokenMidRouter);
// nurbanboard router
app.use('/nurbanboard', nurbanboardRouter);

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});