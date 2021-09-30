var express = require('express');
const app = express();
var bodyParser = require('body-parser');
const { sequelize } = require('./models');
var appversionRouter = require('./router/appversionrouter');

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
app.use('/appversion', appversionRouter)

app.listen(8080, function(){
    console.log('Example app listening on port 8080!')
});