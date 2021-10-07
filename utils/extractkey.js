let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

// input값이 토큰이고 거기서 key(쇼셜 로그인 토큰 또는 이메일)값을 추츨한다.
module.exports = (token) => {
    let decoded = jwt.verify(token, secretObj.secret);
    console.log(`decoded : ${decoded}`);
    let key = decoded.key;
    return key;
}
