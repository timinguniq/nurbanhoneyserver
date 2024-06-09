const insigniaDao = require('../dbdao/insigniadao');
const constObj = require('../config/const');

// User insignia 셋팅
module.exports = async (userId, point, totalLossCut, myArticleNumber, myCommentNumber) => {
    console.log(`myArticleNumber : ${myArticleNumber}`);
    console.log(`myCommentNumber : ${myCommentNumber}`);

    //휘장 아이디어 공고(현재는 글 갯수 10개, 100개 달성, 포인트 100만 달성, 댓글 100개 달성, 1000개 달성, 손절액 50만, 100만, 1000만)
    if(myArticleNumber >= 200){
        let result = await insigniaDao.create(constObj.insigniaArticle200, userId);
        console.log(`insignia article200 create : ${result}`);
    }else if(myArticleNumber >= 180){
        let result = await insigniaDao.create(constObj.insigniaArticle180, userId);
        console.log(`insignia article180 create : ${result}`);
    }else if(myArticleNumber >= 160){
        let result = await insigniaDao.create(constObj.insigniaArticle160, userId);
        console.log(`insignia article160 create : ${result}`);
    }else if(myArticleNumber >= 140){
        let result = await insigniaDao.create(constObj.insigniaArticle140, userId);
        console.log(`insignia article140 create : ${result}`);
    }else if(myArticleNumber >= 120){
        let result = await insigniaDao.create(constObj.insigniaArticle120, userId);
        console.log(`insignia article120 create : ${result}`);
    }else if(myArticleNumber >= 100){
        let result = await insigniaDao.create(constObj.insigniaArticle100, userId);
        console.log(`insignia article100 create : ${result}`);
    }else if(myArticleNumber >= 75){
        let result = await insigniaDao.create(constObj.insigniaArticle75, userId);
        console.log(`insignia article75 create : ${result}`);
    }else if(myArticleNumber >= 50){
        let result = await insigniaDao.create(constObj.insigniaArticle50, userId);
        console.log(`insignia article50 create : ${result}`);
    }else if(myArticleNumber >= 30){
        let result = await insigniaDao.create(constObj.insigniaArticle30, userId);
        console.log(`insignia article30 create : ${result}`);
    }else if(myArticleNumber >= 10){
        let result = await insigniaDao.create(constObj.insigniaArticle10, userId);
        console.log(`insignia article10 create : ${result}`);
    }

    // 내 댓글 1000개, 100개 달성시
    if(myCommentNumber >= 900){
        let result = await insigniaDao.create(constObj.insigniaComment900, userId);
        console.log(`insignia myCommentNumber900 create : ${result}`);
    }else if(myCommentNumber >= 800){
        let result = await insigniaDao.create(constObj.insigniaComment800, userId);
        console.log(`insignia myCommentNumber800 create : ${result}`);
    }else if(myCommentNumber >= 700){
        let result = await insigniaDao.create(constObj.insigniaComment700, userId);
        console.log(`insignia myCommentNumber700 create : ${result}`);
    }else if(myCommentNumber >= 600){
        let result = await insigniaDao.create(constObj.insigniaComment600, userId);
        console.log(`insignia myCommentNumber600 create : ${result}`);
    }else if(myCommentNumber >= 500){
        let result = await insigniaDao.create(constObj.insigniaComment500, userId);
        console.log(`insignia myCommentNumber500 create : ${result}`);
    }else if(myCommentNumber >= 400){
        let result = await insigniaDao.create(constObj.insigniaComment400, userId);
        console.log(`insignia myCommentNumber400 create : ${result}`);
    }else if(myCommentNumber >= 300){
        let result = await insigniaDao.create(constObj.insigniaComment300, userId);
        console.log(`insignia myCommentNumber300 create : ${result}`);
    }else if(myCommentNumber >= 200){
        let result = await insigniaDao.create(constObj.insigniaComment200, userId);
        console.log(`insignia myCommentNumber200 create : ${result}`);
    }else if(myCommentNumber >= 100){
        let result = await insigniaDao.create(constObj.insigniaComment100, userId);
        console.log(`insignia myCommentNumber100 create : ${result}`);
    }else if(myCommentNumber >= 50){
        let result = await insigniaDao.create(constObj.insigniaComment50, userId);
        console.log(`insignia myCommentNumber50 create : ${result}`);
    }

    // 손절액이 100만, 200만, 300만, 400만, 500만, 600만, 700만, 800만, 900만, 1000만
    if(totalLossCut >= 10000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut1000, userId);
        console.log(`insignia lossCut1000 create : ${result}`);
    }else if(totalLossCut >= 9000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut900, userId);
        console.log(`insignia lossCut100 create : ${result}`);
    }else if(totalLossCut >= 8000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut800, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 7000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut700, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 6000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut600, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 5000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut500, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 4000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut400, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 3000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut300, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 2000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut200, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }else if(totalLossCut >= 1000000){
        let result = await insigniaDao.create(constObj.insigniaLossCut100, userId);
        console.log(`insignia lossCut50 create : ${result}`);
    }
}