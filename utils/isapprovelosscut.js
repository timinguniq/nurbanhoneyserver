const totalBoardDao = require('../dbdao/totalboarddao');

// 손실액 기준이 넘는지 확인하는 메소드
// true이면 기준치 통과
// false이면 기준치 실패
module.exports = async (articleId) => {
    try{
        let nurbanBoardDaoResult = await totalBoardDao.readForId(articleId);
        let likeCount = nurbanBoardDaoResult.likeCount;
        let dislikeCount = nurbanBoardDaoResult.dislikeCount;

        if(likeCount < 5){
            return false;
        }
        let ratioLikeCount = likeCount * 3;
        let ratioDislikeCount = dislikeCount * 7;
        if(ratioLikeCount >= ratioDislikeCount){
            return true;
        }else{
            return false;
        }      
    }catch(e){
        return false;
    }   
}