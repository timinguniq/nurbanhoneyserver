const Notice = require('../models').Notice;
const User = require('../models').User;

exports.create = function create(title, content){
    return Notice.create({
        id: 0,
        title: title,
        content: content,
    })
    /*
    id:
      title:
      content:
      count:
      likeCount:
      dislikeCount:
      */
}

// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.read = function read(offset, limit){
    return Notice.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname', ['insigniaShow', 'insignia']]}
        ],
        attributes: ['id', 'title', 'count', 'createdAt'],
        offset: Number(offset),
        limit: Number(limit),
        order: [['id', 'DESC']]
    })
}

// 글을 id로 갯수 가져오기
exports.readForId = function read(id){
    return Notice.findOne({
        where: {
            id: id 
        }
    })
}

// Notice count 업데이트
exports.updateCount = function update(id, count){
    return Notice.update({count: count}, {where: {id: id}})
}

// Notice likeCount 업데이트
exports.updateLikeCount = function update(id, likeCount){
    return Notice.update({likeCount: likeCount}, {where: {id: id}})
}

// Notice dislikeCount 업데이트
exports.updateDislikeCount = function update(id, dislikeCount){
    return Notice.update({dislikeCount: dislikeCount}, {where: {id: id}})
}

// 공지 삭제
exports.destory = function destory(id){
    return Notice.destroy({where: {id: id}})
} 
