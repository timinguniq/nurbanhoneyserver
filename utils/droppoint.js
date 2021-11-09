const userDao = require('../dbdao/userdao');
// 포인트 내리는 코드

// unitPoint
module.exports = async (key, pointUnit) => {
    // point 내리는 로직
    try{
        let userResult = await userDao.read(key)
        let point = userResult.point;
        point -= pointUnit;
        if(point <= 0) point = 0;
        let userPointUpdateResult = await userDao.updatePoint(key, point); 

        if(userPointUpdateResult === 1){
            return true
        }else{
            return false
        }
    }catch(err){
        return false
    }
}