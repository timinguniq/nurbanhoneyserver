let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

// jwt_token 만드는 메소드
module.exports = (key) => {
      // token 만드는 코드
    let token = jwt.sign({
        key: key // 토근의 내용(payload)
    }, 
    secretObj.secret, // 비밀키
    {
        expiresIn: '365d' // 유효기간
    })
    return token
}