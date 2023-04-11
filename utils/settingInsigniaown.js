const insigniaDao = require('../dbdao/insigniadao');
// 전체 휘장 셋팅하는 하는 메소드
module.exports = async (userId) => {
    try{
        let insigniaOwn = await insigniaDao.readOwn(userId);
        console.log('insigniaOwn : ', insigniaOwn);
        var insigniaOwnList = [];
        for(let i = 0 ; i < insigniaOwn.length ; i++){
            let insigniaEle = insigniaOwn[i].dataValues.insignia;
            insigniaOwnList.push(insigniaEle);
        }
        console.log('insigniaOwnList : ', insigniaOwnList);
        return insigniaOwnList;
    }catch(e){
        console.log('insigniaOwn error : ', e);
        return [];
    }
}