var insigniaDao = required('../dbdao/insigniadao');
const constObj = require('../config/const');

// User insignia 셋팅
module.exports = async (userId, point, totalLossCut, myArticleNumber, myCommentNumber) => {
    console.log(`myArticleNumber : ${myArticleNumber}`);
    console.log(`myCommentNumber : ${myCommentNumber}`);

    //휘장 아이디어 공고(현재는 글 갯수 10개, 100개 달성, 포인트 100만 달성, 댓글 100개 달성, 1000개 달성, 손절액 50만, 100만, 1000만)
    if(myArticleNumber >= 100){
        let result = await insigniaDao.create(constObj.insigniaArticle100, userId);
        console.log(`insignia article100 create : ${result}`);
    }else if(myArticleNumber >= 10){
        let result = await insigniaDao.create(constObj.insigniaArticle10, userId);
        console.log(`insignia article10 create : ${result}`);
    }

    // 포인트 100만 달성시 
    if(point >= 1000000){
        let result = await insigniaDao.create(constObj.insigniaPoint1000000, userId);
        console.log(`insignia point1000000 create : ${result}`);
    }

    // 내 댓글 1000개, 100개 달성시
    if(myCommentNumber >= 1000){
        let result = await insigniaDao.create(constObj.insigniaComment1000, userId);
        console.log(`insignia myCommentNumber1000 create : ${result}`);
    }else if(myCommentNumber >= 100){
        let result = await insigniaDao.create(constObj.insigniaComment100, userId);
        console.log(`insignia myCommentNumber100 create : ${result}`);
    }

    // 손절액이 50만, 100만, 1000만
    if(totalLossCut >= 500000){
        let result = await insigniaDao.create(constObj.insigniaLossCut50, userId);
        console.log(`insignia lossCut50 create : ${result}`);

    }else if(totalLossCut >= 1000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut100, userId);
        console.log(`insignia lossCut100 create : ${result}`);

    }else if(totalLossCut >= 10000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut1000, userId);
        console.log(`insignia lossCut1000 create : ${result}`);
    }
}