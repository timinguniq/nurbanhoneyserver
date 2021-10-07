var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');
const userDao = require('../dbdao/userdao');

// token valid
router.post('/exaim', (req, res) => {
    let token = req.body.token;
    if(isValidToken(token)){
        // 토큰이 유효하다
        let resultObject = {};
        let contentObejct = new Object();
        let nameList = ["result","error"];
        let valueList = [true, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exaim_result", contentObejct);
        res.json(resultObject);
    }else{
        // 토큰이 안 유효하다
        let resultObject = {};
        let contentObejct = new Object();
        let nameList = ["result", "error"];
        let valueList = [false, null];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exaim_result", contentObejct);
        res.json(resultObject);
    }
});

// token 재발급(토큰을 받아서 새로운 토큰을 만들어서 준다.)
router.post('/exchange', (req, res) => {
    let token = req.body.token;
    if(isValidToken(token)){
        // 토큰이 유효하다. -> 에러 (토큰이 유효기간이 지난걸 새로 발급해 줘야 되니까)
        let resultObject = {};
        let contentObejct = new Object();
        let nameList = ["token","error"];
        let valueList = [null, "token is not expired"];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("token_exchange_result", contentObejct);
        res.json(resultObject);
    }else{
        // 토큰이 유효하지 않다.
        // TODO : 토큰이 유효하지 않으면 재생성 후 리턴해준다.
        

    }
});

module.exports = router;