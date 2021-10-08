const NurbanBoard = require('../models').NurbanBoard;

exports.create = function create(thumbnail, title, content, userId){
    return NurbanBoard.create({
        id: 0,
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
exports.readForId = function read(id){
    return NurbanBoard.findOne({
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

// 글을 id로 갯수 가져오기
exports.readCount = async function read(offset){
    const { count, rows } = await NurbanBoard.findAndCountAll({
        offset: offset,
        limit: 10
    })    
    return {count, rows}
}

// NurbanBoard content 업데이트
exports.updateContent = function update(id, thumbnail, title, content){
    return NurbanBoard.update({thumbanil: thumbnail, title: title, content: content}, {where: {id: id}})
}

// NurbanBoard count 업데이트
exports.updateCount = function update(count){
    return NurbanBoard.update({count: count}, {where: {id: id}})
}

// NurbanBoard commentCount 업데이트
exports.updateCommentCount = function update(commentCount){
    return NurbanBoard.update({commentCount: commentCcount}, {where: {id: id}})
}

// NurbanBoard likeCount 업데이트
exports.updateLikeCount = function update(likeCount){
    return NurbanBoard.update({likeCount: likeCount}, {where: {id: id}})
}

// NurbanBoard dislikeCount 업데이트
exports.updateDislikeCount = function update(dislikeCount){
    return NurbanBoard.update({dislikeCount: dislikeCcount}, {where: {id: id}})
}

// 글 삭제
exports.destory = function destory(id){
    return NurbanBoard.destroy({where: {id: id}})
} 
