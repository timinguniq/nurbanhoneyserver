var userDao = require('../dbdao/userdao');
const constObj = require('../config/const');

// 포인트에 따른 User Badge 셋팅
module.exports = async (point) => {
    let badge = "";    
    // TODO 포인트 기준은 아직 정해지진 않음
    if(point <= 10000){
        badge = constObj.badge0;
    }else if(point <= 100000){
        badge = constObj.badge1;    
    }else if(point <= 1000000){
        badge = constObj.badge2;
    }else if(point <= 10000000){
        badge = constObj.badge3;
    }else if(point <= 100000000){
        badge = constObj.badge4;
    }else if(point <= 1000000000){
        badge = constObj.badge5;    
    }else if(point <= 10000000000){
        badge = constObj.badge6;    
    }else if(point <= 100000000000){
        badge = constObj.badge7;
    }
    
    try{        
        let result = await userDao.updateBadge(key, badge);
        // result 1이면 성공 0이면 실패
        console.log(`update badge result : ${result}`)
        if(result === 1){
            return true;
        }else{
            return false;
        }
    }catch(e){
        // 카카오 토큰이 유효하지 않다.
        return false;
    }   
}
    