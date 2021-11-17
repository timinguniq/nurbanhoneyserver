const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
// totalLossCut 내리는 코드

// unitPoint
module.exports = async (key, articleId) => {
    // totalLossCut 내리는 로직
    try{
        let userResult = await userDao.read(key)
        let nurbanBoardResult = await nurbanBoardDao.readForId(articleId);
        let lossCut = nurbanBoardResult.lossCut;
        let totalLossCut = userResult.totalLossCut;
        totalLossCut -= lossCut;
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