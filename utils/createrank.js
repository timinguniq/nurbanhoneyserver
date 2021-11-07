const rankDao = require('../dbdao/rankdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');

// 한달에 한번 rank 데이터를 만드는 메소드
module.exports = async () => {    
    try{
        let resultList = await nurbanBoardDao.readForRank();

        let deleteResult = await rankDao.destoryAll();
        if(deleteResult === 1){
            let result = await rankDao.create(totalLossCut, totalLikeCount, userId);
        }else{
            
        }
        let result = await rankDao.create();
    }catch(err){

    }
    console.log("1분 마다 실행");
}