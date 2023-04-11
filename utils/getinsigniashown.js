const insigniaDao = require('../dbdao/insigniadao');

// userId를 이용해서 insigna 구하는 코드
module.exports = async (userId) => {
    let insigniaList = [];

    // string으로 안 가고 array로 가게 수정하는 코드
    let insigniaShown = await insigniaDao.readShown(userId);

    for(var j = 0 ; j < insigniaShown.length ; j++){
        console.log('insigniaShown[j] : ', insigniaShown[j].dataValues);
        insigniaList.push(insigniaShown[j].dataValues.insignia);
    }

    return insigniaList;
}