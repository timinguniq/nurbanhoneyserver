const userDao = require('../dbdao/userdao');

const totalBoardDao = require('../dbdao/totalboarddao');

// totalLossCut 올리는 코드

// unitPoint
module.exports = async (key, articleId) => {
    // totalLossCut 올리는 로직
    try{
        let userResult = await userDao.read(key)
        let nurbnaBoardResult = await totalBoardDao.readForId(articleId);
        let lossCut = nurbnaBoardResult.lossCut;
        let totalLossCut = userResult.totalLossCut;
        totalLossCut += lossCut;
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