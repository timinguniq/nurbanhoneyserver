var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');
let createJwtToken = require('../utils/createjwttoken');
let extractKey = require('../utils/extractkey');

// token valid
router.post('/exam', async (req, res) => {
    let token = req.body.token;
    
    let resultObject = {};
    let contentObejct = new Object();
    if(isValidToken(token)){
        // 토큰이 유효하다
        resultObject = createJson.result(true);
        res.status(200).json(resultObject);
    }else{
        // 토큰이 안 유효하다
        resultObject = createJson.result(false);
        res.status(200).json(resultObject);
    }
});

// token 재발급(토큰을 받아서 새로운 토큰을 만들어서 준다.)
router.post('/exchange', async (req, res) => {
    let token = req.body.token;

    let resultObject = {};
    let contentObejct = new Object();
    if(isValidToken(token)){
        // 토큰이 유효하다. -> 에러 (토큰이 유효기간이 지난걸 새로 발급해 줘야 되니까)
        resultObject = createJson.error("token is not expired");
        res.status(400).json(resultObject);
    }else{
        // 토큰이 유효하지 않다.
        // TODO : 토큰이 유효하지 않으면 재생성 후 리턴해준다.
        
        // 토큰에서 키 값 추출
        let key = extractKey(token);

        // TODO : 유효기간이 지난 token에서도 key값을 추출할 수 있는지 확인해 봐야 될듯

        // token 만드는 코드
        let token = createJwtToken(key);

        let nameList = ["token"];
        let valueList = [token];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.multi(nameList, valueList);
        res.status(200).json(resultObject);
    }
});

module.exports = router;