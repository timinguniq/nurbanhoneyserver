var userDao = require('../dbdao/userdao');
const constObj = require('../config/const');

// 포인트에 따른 User Badge 셋팅
module.exports = async (key, point) => {
    let badge = "";
    // TODO 포인트 기준은 아직 정해지진 않음, 나중에 올려야됨.
    if(point <= 50){
        badge = constObj.badge0;
    }else if(point <= 100){
        badge = constObj.badge1;    
    }else if(point <= 150){
        badge = constObj.badge2;
    }else if(point <= 200){
        badge = constObj.badge3;
    }else if(point <= 250){
        badge = constObj.badge4;
    }else if(point <= 300){
        badge = constObj.badge5;    
    }else if(point <= 350){
        badge = constObj.badge6;    
    }else if(point <= 400){
        badge = constObj.badge7;
    }else if(point <= 450){
        badge = constObj.badge8;
    }else if(point <= 500){
        badge = constObj.badge9;
    }else if(point <= 600){
        badge = constObj.badge10;
    }else if(point <= 700){
        badge = constObj.badge11;
    }else if(point <= 800){
        badge = constObj.badge12;
    }else if(point <= 900){
        badge = constObj.badge13;
    }else if(point <= 1000){
        badge = constObj.badge14;
    }else if(point <= 1100){
        badge = constObj.badge15;
    }else if(point <= 1200){
        badge = constObj.badge16;
    }else if(point <= 1300){
        badge = constObj.badge17;
    }else if(point <= 1400){
        badge = constObj.badge18;
    }else{
        badge = constObj.badge19;
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
    