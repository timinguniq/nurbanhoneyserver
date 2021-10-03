var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');

let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');


// token valid
// 토큰 테스트
router.use((req, res, next) => {
    let decoded = jwt.verify(token, secretObj.secret);
    console.log(`decoded : ${decoded}`);

    // 나중에 테스트
    let token = req.headers.token;
    if(isValidToken(token)){
        // 토큰이 유효하다
        next();
    }else{
        // 토큰이 안 유효하다
        let resultObject = {};
        resultObject = createJson("server_error", "token_expired");
        res.json(JSON.stringify(resultObject));
    }
});

module.exports = router;