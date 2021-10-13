var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');
let createJwtToken = require('../utils/createjwttoken');
let extractKey = require('../utils/extractkey');
const userDao = require('../dbdao/userdao');

// token valid
router.post('/exam', async (req, res) => {
    let token = req.body.token;
    
    let resultObject = {};
    let contentObejct = new Object();
    if(isValidToken(token)){
        // 토큰이 유효하다
        let nameList = ["result", "error"];
        let valueList = [true, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exaim_result", contentObejct);
    }else{
        // 토큰이 안 유효하다
        let nameList = ["result", "error"];
        let valueList = [false, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exaim_result", contentObejct);
    }
    res.json(resultObject);
});

// token 재발급(토큰을 받아서 새로운 토큰을 만들어서 준다.)
router.post('/exchange', async (req, res) => {
    let token = req.body.token;

    let resultObject = {};
    let contentObejct = new Object();
    if(isValidToken(token)){
        // 토큰이 유효하다. -> 에러 (토큰이 유효기간이 지난걸 새로 발급해 줘야 되니까)
        let nameList = ["token","error"];
        let valueList = [null, "token is not expired"];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exchange_result", contentObejct);
    }else{
        // 토큰이 유효하지 않다.
        // TODO : 토큰이 유효하지 않으면 재생성 후 리턴해준다.
        
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // TODO : 유효기간이 지난 token에서도 key값을 추출할 수 있는지 확인해 봐야 될듯

        // token 만드는 코드
        let token = createJwtToken(key);

        let nameList = ["token","error"];
        let valueList = [token, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exchange_result", contentObejct);
    }
    res.json(resultObject);
});

module.exports = router;