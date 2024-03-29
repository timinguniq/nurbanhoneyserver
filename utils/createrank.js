const rankDao = require('../dbdao/rankdao');

const totalBoardDao = require('../dbdao/totalboarddao');

// 한달에 한번 rank 데이터를 만드는 메소드
module.exports = async () => {    
    let contentObjectList = [];
    try{
        let resultList = await totalBoardDao.readForRank();

        for(var i = 0 ; i < resultList.length ; i++){
            contentObjectList.push(resultList[i].dataValues);
        }        
        console.log("contentObjectList : ", contentObjectList);
    }catch(err){
        console.log("nurbanBoardDao readForRank error", err);
    }

    try{
        let rankResult = await rankDao.read();
        if(rankResult.length === 0){
            console.log('rankResult empty');
            for(var i = 0 ; i < contentObjectList.length ; i++){
                let result = await rankDao.create(contentObjectList[i].sumLossCut, 
                    contentObjectList[i].sumLikeCount, contentObjectList[i].userId);
            }
        }else{
            console.log('rankResult not empty');
            let deleteResult = await rankDao.destroyAll();
            console.log("delete Result : ", deleteResult);
            
            if(deleteResult === 1){
                for(var i = 0 ; i < contentObjectList.length ; i++){
                    let result = await rankDao.create(contentObjectList[i].sumLossCut, 
                        contentObjectList[i].sumLikeCount, contentObjectList[i].userId);
                }
            }     
        }   
    }catch(err){
        console.log("rankDao destroyAll error : ", err)
    }

    console.log("1분 마다 실행");
}