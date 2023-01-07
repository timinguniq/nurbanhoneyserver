var express = require('express');
var router = express.Router();
var createJson = require('../utils/createjson');
var isValidToken = require('../utils/isvalidtoken.js');

// token valid
// 토큰 테스트
router.use((req, res, next) => {
    // 나중에 테스트
    //let token = req.headers.token;
    let auth = req.headers.authorization;
    let token = auth.replace('Bearer ', '');
    console.log('token : ', token);
    if(isValidToken(token)){
        // 토큰이 유효하다
        next();
    }else{
        // 토큰이 안 유효하다
        let resultObject = createJson.error("token_expired");
        res.status(401).json(resultObject);
    }
});

module.exports = router;