const insigniaDao = require('../dbdao/insigniadao');
// 전체 휘장 셋팅하는 하는 메소드
module.exports = async (userId) => {
    try{
        let insigniaShown = await insigniaDao.readShown(userId);
        console.log('insigniaShown : ', insigniaShown);
        var insigniaShownList = [];
        for(let i = 0 ; i < insigniaShown.length ; i++){
          let insigniaEle = insigniaShown[i].dataValues.insignia;
          insigniaShownList.push(insigniaEle);
        }
        console.log('insigniaShownList : ', insigniaShownList);
        return insigniaShownList;
    }catch(e){
        console.log('insigniaShown error : ', e);
        return [];
    }
}