var userDao = require('../dbdao/userdao');
const constObj = require('../config/const');

// User insignia 셋팅
module.exports = async (key, insigniaOwn, point, totalLossCut, myArticleNumber, myCommentNumber) => {
    let insignia = [];
    console.log(`myArticleNumber : ${myArticleNumber}`);
    console.log(`myCommentNumber : ${myCommentNumber}`);
    console.log("insignia : ", insignia);

    if(insigniaOwn !== null){
        insignia = insigniaOwn;
    }

    //휘장 아이디어 공고(현재는 글 갯수 10개, 100개 달성, 포인트 100만 달성, 댓글 100개 달성, 1000개 달성, 손절액 50만, 100만, 1000만)
    if(myArticleNumber >= 100){
        if(!insignia.includes(constObj.insigniaArticle100)){
            insignia.push(constObj.insigniaArticle100);
        }
    }else if(myArticleNumber >= 10){
        if(!insignia.includes(constObj.insigniaArticle10)){
            insignia.push(constObj.insigniaArticle10);
        }
    }

    // 포인트 100만 달성시 
    if(point >= 1000000){
        if(!insignia.includes(constObj.insigniaPoint1000000)){
            insignia.push(constObj.insigniaPoint1000000);    
        }
    }

    // 내 댓글 1000개, 100개 달성시
    if(myCommentNumber >= 1000){
        if(!insignia.includes(constObj.insigniaComment1000)){
            insignia.push(constObj.insigniaComment1000);       
        }
    }else if(myCommentNumber >= 100){
        if(!insignia.includes(constObj.insigniaComment100)){
            insignia.push(constObj.insigniaComment100);       
        }
    }

    // 손절액이 50만, 100만, 1000만
    if(totalLossCut >= 500000){
        if(!insignia.includes(constObj.insigniaLossCut50)){
            insignia.push(constObj.insigniaLossCut50);       
        }
    }else if(totalLossCut >= 1000000){
        if(!insignia.includes(constObj.insigniaLossCut100)){
            insignia.push(constObj.insigniaLossCut100);       
        }
    }else if(totalLossCut >= 10000000){
        if(!insignia.includes(constObj.insigniaLossCut1000)){
            insignia.push(constObj.insigniaLossCut1000);       
        }
    }

    try{        
        let insigniaString = JSON.stringify(insignia);
        let insigniaData = JSON.parse(insigniaString);
        let result = await userDao.updateInsigniaOwn(key, insigniaData);
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