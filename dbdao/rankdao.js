const Rank = require('../models').rank;
const User = require('../models').user;

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
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'totalLossCut', 'totalLikeCount'],
    })
}

// 팝업 데이터 가져오는 메소드
exports.readPopup = function read(offset = 0, limit = 3){
    return Rank.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'totalLossCut', 'totalLikeCount'],
        offset: Number(offset),
        limit: Number(limit)
    })
}

// 모든 데이터 삭제
exports.destoryAll = function destory() {
    // 전체 데이터 삭제
    return Rank.truncate();
}

// 랭크 데이터 유저 아이디로 삭제
exports.destoryForUserId = function desotry(userId){
    return Rank.desotry({while: {userId: userId}})
}
