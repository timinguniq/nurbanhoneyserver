const nurbanLikeDao = require('../dbdao/nurbanlikedao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');

// 너반꿀 게시판에 좋아요 수 업데이트 하는 메소드
module.exports = async (articleId, resultObject, res) => {
    // 기사의 좋아요 카우터 수 가져오기
    let likeCount = -1
    try{
        let result = await nurbanLikeDao.readCount(articleId);
        console.log(result.dataValues.n_ids)
        likeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 너반꿀 게시판 테이블에 likeCount 증가하는 코드
    try{
        if(likeCount !== -1){
            let result = await nurbanBoardDao.updateLikeCount(articleId, likeCount);
        }        
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }
}