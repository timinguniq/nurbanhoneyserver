var userDao = require('../dbdao/userdao');
const constObj = require('../config/const');

// 포인트에 따른 User Badge 셋팅
module.exports = async (key, point) => {
    let badge = "";
    // TODO 포인트 기준은 아직 정해지진 않음, 나중에 올려야됨.
    if(point <= 200){
        badge = constObj.badge0;
    }else if(point <= 250){
        badge = constObj.badge1;    
    }else if(point <= 300){
        badge = constObj.badge2;
    }else if(point <= 350){
        badge = constObj.badge3;
    }else if(point <= 400){
        badge = constObj.badge4;
    }else if(point <= 450){
        badge = constObj.badge5;    
    }else if(point <= 500){
        badge = constObj.badge6;    
    }else if(point <= 550){
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
    }catch(err){
        console.log(`update badge err : ${err}`);
        return false;
    }   
}
    