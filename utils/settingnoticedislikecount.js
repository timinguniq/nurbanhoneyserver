const noticeDislikeDao = require('../dbdao/noticedislikedao');
const noticeDao = require('../dbdao/noticedao');

// 공지사항 싫어요 수 업데이트 하는 메소드
module.exports = async (noticeId, resultObject, res) => {
    // 기사의 싫어요 카운터 수 가져오기
    let dislikeCount = -1
    try{
        let result = await noticeDislikeDao.readCount(noticeId);
        dislikeCount = result[0].dataValues.n_ids;
    }catch(err){
        console.log(err);
    }

    // 너반꿀 게시판 테이블에 disLikeCount 업데이트하는 코드
    try{
        if(dislikeCount !== -1){
            let result = await noticeDao.updateDislikeCount(noticeId, dislikeCount);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
        return res.end();   
    }
}