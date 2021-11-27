const nurbanDislikeDao = require('../dbdao/nurbandislikedao');
const nurbanLikeDao = require('../dbdao/nurbanlikedao');

// 너반꿀 게시판 myrating을 만드는 통신
module.exports = async (articleId, userId) => {
    let myRating = "";
    // 좋아요 데이터 받아오는 코드
    try{
        like = await nurbanLikeDao.read(articleId, userId);
        console.log("like result", like);
        if(like !== null){
            myRating = 'like'; 
        }
    }catch(err){
        console.log("like err", err);
    }
    // 싫어요 데이터 받아오는 코드
    try{
        dislike = await nurbanDislikeDao.read(articleId, userId);
        console.log("dislike result", dislike);
        if(dislike !== null){
            myRating = 'dislike';
        }
    }catch(err){
        console.log("dislike err", err);
    }
    return myRating;
}