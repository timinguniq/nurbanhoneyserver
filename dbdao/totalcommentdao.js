const TotalComment = require('../models').total_comment;
const User = require('../models').user;
const TotalBoard = require('../models').totalboard;
const { Op } = require('sequelize');
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
exports.readCount = function read(articleId, commentId = -1, limit = 10){
        return commentId == -1 ? TotalComment.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'content', 'articleId'],
        limit: Number(limit),
        where: {
            articleId: articleId,
            id: {
                [Op.gte]: commentId
            }
        },
        order: [['id', 'DESC']]
    })
    : TotalComment.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'content', 'articleId'],
        limit: Number(limit),
        where: {
            articleId: articleId,
            id: {
                [Op.lte]: commentId
            }
        },
        order: [['id', 'DESC']]
    })
}

// 댓글을 userId로 검색
exports.readForUserId = function read(userId, offset = 0, limit = 10){
    return TotalComment.findAll({
        include: [
            // ['id', 'aritcleId'] === id AS articleId
            {model: TotalBoard, as: 'location', attributes: [['id', 'articleId'], 'title']}
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
    return TotalComment.findOne({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
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
    return TotalComment.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// TotalComment Content 수정 
exports.updateContent = function update(id, content){
    return TotalComment.update({content: content}, {where: {id: id}})
}

// 댓글 삭제
exports.destory = function destory(id){
    return TotalComment.destroy({where: {id: id}})
}