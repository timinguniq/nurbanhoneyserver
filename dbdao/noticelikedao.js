const NoticeLike = require('../models').notice_like;
const { sequelize } = require('../models');

// create
exports.create = function create(noticeId, userId){
    return NoticeLike.create({
        id: 0,
        noticeId: noticeId,
        userId: userId
    })
}
 
// read
exports.read = function read(noticeId, userId){
    return NoticeLike.findOne({
        where: {
            noticeId: noticeId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(noticeId){
    return NoticeLike.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            noticeId: noticeId
        }
    });
}

// update 
exports.update = function update(id){
    return NoticeLike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return NoticeLike.destroy({where: {id: id}})
}

// destroy noticeId userId
exports.destoryUserId = function destroy(noticeId, userId){
    return NoticeLike.destroy({where: {noticeId: noticeId, userId: userId}})
}