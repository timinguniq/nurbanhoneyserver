var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');

// token valid
// 토큰 테스트
router.post('/exaim', (req, res) => {
    // 나중에 테스트
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

module.exports = router;