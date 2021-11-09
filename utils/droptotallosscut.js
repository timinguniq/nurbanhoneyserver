const userDao = require('../dbdao/userdao');
// totalLossCut 내리는 코드

// unitPoint
module.exports = async (key, pointUnit) => {
    // totalLossCut 내리는 로직
    try{
        let userResult = await userDao.read(key)
        let totalLossCut = userResult.totalLossCut;
        totalLossCut -= pointUnit;
        if(totalLossCut <= 0) totalLossCut = 0;
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