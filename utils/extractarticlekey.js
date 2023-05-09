const totalBoardDao = require('../dbdao/totalboarddao');

const totalBoardDao = require('../dbdao/totalboarddao');

// articleId를 가지고 그 글을 작성 사용자의 key값을 추출한다.
// input값이 articleId값이고 key 값을 추츨한다.
module.exports = async (articleId) => {
    let key = "";
    try{
        //let result = await nurbanBoradDao.readForId(articleId);
        let result = await totalBoardDao.readForId(articleId);
        key = result.User.key;
        if(key !== null && key !== undefined){
            return key;
        }else{
            return false;
        }
    }catch(err){
        console.log(`error : ${err}`);
        return false;
    }
}