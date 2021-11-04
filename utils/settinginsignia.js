var userDao = require('../dbdao/userdao');
const constObj = require('../config/const');

// User insignia 셋팅
module.exports = async (key, point, myArticleNumber, myCommentNumber) => {
    let insignia = [];
    console.log(`myArticleNumber : ${myArticleNumber}`);
    console.log(`myCommentNumber : ${myCommentNumber}`);
    //휘장 아이디어 공고(현재는 글 갯수 10개, 100개 달성, 포인트 100만 달성, 댓글 100개 달성, 1000개 달성)
    if(myArticleNumber >= 100){
        insignia.push(constObj.insigniaArticle100);
    }else if(myArticleNumber >= 10){
        insignia.push(constObj.insigniaArticle10);
    }

    if(point >= 1000000){
        insignia.push(constObj.insigniaPoint1000000);    
    }

    if(myCommentNumber >= 1000){
        insignia.push(constObj.insigniaComment1000);    
    }else if(myCommentNumber >= 100){
        insignia.push(constObj.insigniaComment100);        
    }

    try{        
        let result = await userDao.updateInsigniaOwn(key, insignia);
        // result 1이면 성공 0이면 실패
        console.log(`update insignia result : ${result}`)
        if(result === 1){
            return true;
        }else{
            return false;
        }
    }catch(err){
        console.log(`update insignia err : ${err}`);
        return false;
    }   
}