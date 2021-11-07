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
var nurbanBoardRouter = require('./router/nurbanboardrouter');
var nurbanBoardAuthRouter = require('./router/nurbanboardauthrouter');
var nurbanCommentRouter = require('./router/nurbancommentrouter');
var nurbanCommentAuthRouter = require('./router/nurbancommentauthrouter');
var nurbanLikeAuthRouter = require('./router/nurbanlikeauthrouter');
var nurbanDislikeAuthRouter = require('./router/nurbandislikeauthrouter');
var profileAuthRouter = require('./router/profileauthrouter');
var rankRouter = require('./router/rankrouter');
let createRank = require('./utils/createrank');
let schedule = require('node-schedule');
const nurbanboardDao = require('./dbdao/nurbanboarddao');
const { v4: uuidv4 } = require('uuid');

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

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)
*/

const job = schedule.scheduleJob('60 * * * * *', createRank);

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
      'uuid' : uuidv4(),
      'thumbnail' : null,
      'title' : String(i),
      'lossPrice' : i,
      'content' : String(i),
      'userId' : 1
    }
    dataList.push(tempData);
  }
  
  for(var j = 0 ; j < dataList.length ; j++){
    try{
      let result = await nurbanboardDao.create(dataList[j].uuid, dataList[j].thumbnail,
              dataList[j].title, dataList[j].lossPrice, dataList[j].content, 1);
      console.log(`result : ${result}`);
    }catch(err){
      console.log(`err : ${err}`);
    }
  }
  res.end();
})

// appversion rounter
app.use('/appversion', appversionRouter);
// user router
app.use('/login', loginRouter);
// nurbanboard router
app.use('/nurbanboard', nurbanBoardRouter);
// nurbancomment router
app.use('/nurbancomment', nurbanCommentRouter);
// rank router
app.use('/rank', rankRouter);
// token router
app.use('/token', tokenRouter);
// token valid
app.use('/', tokenMidRouter);
// auth
// nurbanboard router
app.use('/nurbanboard', nurbanBoardAuthRouter);
// nurbancomment router
app.use('/nurbancomment', nurbanCommentAuthRouter);
// nurbanlike router
app.use('/nurbanlike', nurbanLikeAuthRouter);
// nurbandislike router
app.use('/nurbandislike', nurbanDislikeAuthRouter);
// profile
app.use('/profile', profileAuthRouter);

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});