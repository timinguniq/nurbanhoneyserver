var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');

// token valid
// 토큰 테스트
router.use((req, res, next) => {
    // 나중에 테스트
    let token = req.headers.token;
    if(isValidToken(token)){
        // 토큰이 유효하다
        next();
    }else{
        // 토큰이 안 유효하다
        let resultObject = {};
        let contentObejct = new Object();
        let nameList = ["error"];
        let valueList = ["token_expired"];
        contentObejct = createJson.multi(nameList, valueList);
        resultObject = createJson.one("server_error", contentObejct);
        res.json(resultObject);
    }
});

module.exports = router;