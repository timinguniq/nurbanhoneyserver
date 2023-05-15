const NoticeComment = require('../models').notice_comment;
const User = require('../models').user;
const { sequelize } = require('../models');

exports.create = function create(content, noticeId, userId){
    return NoticeComment.create({
        id: 0,
        content: content,
        noticeId: noticeId,
        userId: userId
    })
}
 
// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readCount = function read(noticeId, offset = 0, limit = 10){
        return NoticeComment.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'content', 'noticeId'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            noticeId: noticeId
        },
        order: [['id', 'DESC']]
    })
}

// 글을 id로 comment 하나 데이터 가져오는 메소드
exports.read = function read(id){
    return NoticeComment.findOne({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'content', 'noticeId'],
        where: {
            id: id
        },
        order: [['id', 'DESC']]
    })
}

// userId에 따라 갯수 확인하는 메소드
exports.readCountForUserId = function read(userId){
    return NoticeComment.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// NoticeComment Content 수정 
exports.updateContent = function update(id, content){
    return NoticeComment.update({content: content}, {where: {id: id}})
}

// 댓글 삭제
exports.destory = function destory(id){
    return NoticeComment.destroy({where: {id: id}})
}