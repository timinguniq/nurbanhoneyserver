const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const rankDao = require('../dbdao/rankdao');

// 한달에 한번 rank 데이터를 만드는 메소드
module.exports = async () => {    
    let contentObjectList = [];
    try{
        let resultList = await nurbanBoardDao.readForRank();

        for(var i = 0 ; i < resultList.length ; i++){
            contentObjectList.push(resultList[i].dataValues);
        }        
        console.log("contentObjectList : ", contentObjectList);
    }catch(err){
        console.log("nurbanBoardDao readForRank error", err);
    }

    try{
        let rankResult = await rankDao.read();
        console.log('rankResult : ', rankResult);


        let deleteResult = await rankDao.destoryAll();
        console.log("delete Result : ", deleteResult);
        if(deleteResult === 1){
            for(var i = 0 ; i < contentObjectList.length ; i++){
                let result = await rankDao.create(contentObjectList[i].sumLossCut, 
                    contentObjectList[i].sumLikeCount, contentObjectList[i].userId);
            }
        }        
    }catch(err){
        console.log("rankDao destroyAll error")
    }

    console.log("1분 마다 실행");
}