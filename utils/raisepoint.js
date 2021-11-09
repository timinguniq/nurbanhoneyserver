const userDao = require('../dbdao/userdao');
// 포인트 올리는 코드

// unitPoint
module.exports = async (key, pointUnit) => {
    // point 올리는 로직
    try{
        let userResult = await userDao.read(key)
        let point = userResult.point;
        point += pointUnit;
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