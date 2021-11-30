const noticeDislikeDao = require('../dbdao/noticedislikedao');
const noticeLikeDao = require('../dbdao/noticelikedao');

// 공지사항 myrating을 만드는 통신
module.exports = async (noticeId, userId) => {
    let myRating = null;
    // 좋아요 데이터 받아오는 코드
    try{
        let like = await noticeLikeDao.read(noticeId, userId);
        console.log("like result", like);
        if(like !== null){
            myRating = 'like'; 
        }
    }catch(err){
        console.log("like err", err);
    }
    // 싫어요 데이터 받아오는 코드
    try{
        let dislike = await noticeDislikeDao.read(noticeId, userId);
        console.log("dislike result", dislike);
        if(dislike !== null){
            myRating = 'dislike';
        }
    }catch(err){
        console.log("dislike err", err);
    }
    return myRating;    
}