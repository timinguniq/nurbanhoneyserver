const Rank = require('../models').Rank;

exports.create = function create(totalLossCut, totalLikeCount, userId){
    return Rank.create({
        id: 0,
        totalLossCut: totalLossCut,
        totalLikeCount: totalLikeCount,
        userId: userId
    })
}

// db의 전체 데이터 가져오는 메소드
exports.read = function read(){
    return Rank.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname', ['insigniaShow', 'insignia']]}
        ],
        attributes: ['id', 'totalLossCut', 'totalLikeCount'],
    })
}

// 모든 데이터 삭제
exports.destoryAll = function destory(){
    // 전체 데이터 삭제
    return Rank.destroy()
} 
