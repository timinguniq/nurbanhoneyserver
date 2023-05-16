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
var noticeRouter = require('./router/noticerouter');
var noticeCommentRouter = require('./router/noticecommentrouter');
var noticeCommentAuthRouter = require('./router/noticecommentauthrouter');
var noticeLikeAuthRouter = require('./router/noticelikeauthrouter');
var noticeDislikeAuthRouter = require('./router/noticedislikeauthrouter');
var rankRouter = require('./router/rankrouter');
var popularBoardRouter = require('./router/popularboardrouter');
var boardRouter = require('./router/boardrouter');
var freeBoardRouter = require('./router/freeboardrouter');
var freeBoardAuthRouter = require('./router/freeboardauthrouter');
var freeCommentRouter = require('./router/freecommentrouter');
var freeCommentAuthRouter = require('./router/freecommentauthrouter');
var freeLikeAuthRouter = require('./router/freelikeauthrouter');
var freeDislikeAuthRouter = require('./router/freedislikeauthrouter');

let createRank = require('./utils/createrank');
let schedule = require('node-schedule');
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

const job = schedule.scheduleJob('10 57 8 16 * *', createRank);

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
/*
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
*/
// appversion rounter
app.use('/appversion', appversionRouter);
// user router
app.use('/login', loginRouter);
// nurbanboard router
app.use('/board/nurban', nurbanBoardRouter);
// nurbancomment router
app.use('/board/nurban/article/comment', nurbanCommentRouter);
// rank router
app.use('/rank', rankRouter);
// notice router
app.use('/board/notice', noticeRouter);
// noticecomment router
app.use('/board/notice/article/comment', noticeCommentRouter);
// popularboard router
app.use('/board/popular', popularBoardRouter);
// board router
app.use('/board', boardRouter);
// freeboard router
app.use('/board/free', freeBoardRouter);
// freeboard router
app.use('/board/free/article/comment', freeCommentRouter);

// token router
app.use('/token', tokenRouter);
// token valid
app.use('/', tokenMidRouter);
// auth
// nurbanboard router
app.use('/board/nurban/article', nurbanBoardAuthRouter);
// nurbancomment router
app.use('/board/nurban/article/comment', nurbanCommentAuthRouter);
// nurbanlike router
app.use('/board/nurban/article/like', nurbanLikeAuthRouter);
// nurbandislike router
app.use('/board/nurban/article/dislike', nurbanDislikeAuthRouter);
// profile
app.use('/profile', profileAuthRouter);
// noticecomment router
app.use('/board/notice/article/comment', noticeCommentAuthRouter);
// noticelike router
app.use('/board/notice/article/like', noticeLikeAuthRouter);
// noticedislike router
app.use('/board/notice/article/dislike', noticeDislikeAuthRouter);
// freeboard router
app.use('/board/free/article', freeBoardAuthRouter);
// freecomment router
app.use('/board/free/article/comment', freeCommentAuthRouter);
// freelike router
app.use('/board/free/article/like', freeLikeAuthRouter);
// freedislike router
app.use('/board/free/article/dislike', freeDislikeAuthRouter);


app.listen(8128, function(){
    console.log('Example app listening on port 8128!')
});
