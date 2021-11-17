const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
// totalLossCut 올리는 코드

// unitPoint
module.exports = async (key, pointUnit) => {
    // totalLossCut 올리는 로직
    try{
        let userResult = await userDao.read(key)
        let totalLossCut = userResult.totalLossCut;
        totalLossCut += pointUnit;
        let userTotalUpdateResult = await userDao.updateTotalLossCut(key, totalLossCut); 
        if(userTotalUpdateResult === 1){
            return true
        }else{
            return false
        }
    }catch(err){
        return false
    }
}