const NurbanBoard = require('../models').NurbanBoard;
const User = require('../models').User;

exports.create = function create(uuid, thumbnail, title, content, userId){
    return NurbanBoard.create({
        id: 0,
        uuid: uuid,
        thumbnail: thumbnail,
        title: title,
        content: content,
        userId: userId
    })
/*
    id: {
      thumbanil: {
      title: {
      content: {
      count: {
      commentCount: {
      likeCount: {
      dislikeCount: {
      userId: {    
  }*/
}

// 글 id로 검색
/* 예제 코드로 남겨놓음
exports.readForId = function read(id){
    return NurbanBoard.findOne({
        where: {
            id: id 
        }
    })
}
*/

// 글 id로 검색
exports.readForId = function read(id){
    return NurbanBoard.findOne({
        include:[
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'profile', 'nickname', 'insignia']}
        ],
        where: {
            id: id 
        }
    })
}
 
// 글 userId로 검색
exports.readForUserId = function read(userId){
    return NurbanBoard.findOne({
        where: {
            userId: userId 
        }
    })
}

// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readCount = async function read(offset = 0, limit = 10){
    const { count, rows } = await NurbanBoard.findAndCountAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'profile', 'nickname', 'insignia']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount'],
        offset: Number(offset),
        limit: Number(limit),
        order: [['id', 'DESC']]
    })
    return {count, rows}
}

// NurbanBoard content 업데이트
exports.updateContent = function update(id, thumbnail, title, content){
    return NurbanBoard.update({thumbanil: thumbnail, title: title, content: content}, {where: {id: id}})
}

// NurbanBoard count 업데이트
exports.updateCount = function update(id, count){
    return NurbanBoard.update({count: count}, {where: {id: id}})
}

// NurbanBoard commentCount 업데이트
exports.updateCommentCount = function update(id, commentCount){
    return NurbanBoard.update({commentCount: commentCount}, {where: {id: id}})
}

// NurbanBoard likeCount 업데이트
exports.updateLikeCount = function update(id, likeCount){
    return NurbanBoard.update({likeCount: likeCount}, {where: {id: id}})
}

// NurbanBoard dislikeCount 업데이트
exports.updateDislikeCount = function update(id, dislikeCount){
    return NurbanBoard.update({dislikeCount: dislikeCount}, {where: {id: id}})
}

// 글 삭제
exports.destory = function destory(id){
    return NurbanBoard.destroy({where: {id: id}})
} 
