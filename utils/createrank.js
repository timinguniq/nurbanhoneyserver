const rankDao = require('../dbdao/rankdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');

// 한달에 한번 rank 데이터를 만드는 메소드
module.exports = async () => {    
    try{
        let resultList = await nurbanBoardDao.readForRank();

        let contentObjectList = [];

        for(var i = 0 ; i < resultList.length ; i++){
            contentObjectList.push(resultList[i].dataValues);
        }
        
        let deleteResult = await rankDao.destoryAll();
        if(deleteResult === 1){
            for(var i = 0 ; i < contentObjectList.length ; i++){
                let result = await rankDao.create(contentObjectList[i].sumLossCut, 
                    contentObjectList[i].sumLikeCount, contentObjectList[i].userId);
            }
        }        
    }catch(err){

    }
    console.log("1분 마다 실행");
}