const NurbanComment = require('../models').NurbanComment;
const User = require('../models').User;

exports.create = function create(content, articleId, userId){
    return NurbanComment.create({
        id: 0,
        content: content,
        articleId: articleId,
        userId: userId
    })
}
 
// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readCount = function read(articleId, offset = 0, limit = 10){
        return NurbanComment.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname', 'insigniaShow']}
        ],
        attributes: ['id', 'content', 'articleId'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            articleId: articleId
        }
    })
}

// NurbanComment Content 수정 
exports.updateContent = function update(id, content){
    return NurbanComment.update({content: content}, {where: {id: id}})
}

// 댓글 삭제
exports.destory = function destory(id){
    return NurbanComment.destroy({where: {id: id}})
}