const NurbanComment = require('../models').NurbanComment;
const User = require('../models').User;
const NurbanBoard = require('../models').NurbanBoard;
const { sequelize } = require('../models');

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
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname', ['insigniaShow', 'insignia']]}
        ],
        attributes: ['id', 'content', 'articleId'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            articleId: articleId
        },
        order: [['id', 'DESC']]
    })
}

// 댓글을 userId로 검색
exports.readForUserId = function read(userId, offset = 0, limit = 10){
    return NurbanComment.findAll({
        include: [
            // ['id', 'aritcleId'] === id AS articleId
            {model: NurbanBoard, as: 'Location', attributes: [['id', 'articleId'], 'title']}
        ],
        attributes: ['id', 'content', 'createdAt'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            userId: userId
        },
        order: [['id', 'DESC']]
    })
}

// 글을 id로 comment 하나 데이터 가져오는 메소드
exports.read = function read(id){
    return NurbanComment.findOne({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname', ['insigniaShow', 'insignia']]}
        ],
        attributes: ['id', 'content', 'articleId'],
        where: {
            id: id
        },
        order: [['id', 'DESC']]
    })
}

// userId에 따라 갯수 확인하는 메소드
exports.readCountForUserId = function read(userId){
    return NurbanComment.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// NurbanComment Content 수정 
exports.updateContent = function update(id, content){
    return NurbanComment.update({content: content}, {where: {id: id}})
}

// 댓글 삭제
exports.destory = function destory(id){
    return NurbanComment.destroy({where: {id: id}})
}