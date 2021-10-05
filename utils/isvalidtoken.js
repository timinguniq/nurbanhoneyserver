let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

// 유효한 토큰인지 확인하는 메소드
module.exports = (token) => {
    try{
        let decoded = jwt.verify(token, secretObj.secret);

        if(decoded){
            // 권한이 있음.
            return true;
        }else{
            // 권한이 없음.
            return false;
        }
    }catch(e){
        return false;
    }
    
}