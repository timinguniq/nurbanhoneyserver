const NoticeDislike = require('../models').notice_dislike;
const { sequelize } = require('../models');

// create
exports.create = function create(noticeId, userId){
    return NoticeDislike.create({
        id: 0,
        noticeId: noticeId,
        userId: userId
    })
}
 
// read
exports.read = function read(noticeId, userId){
    return NoticeDislike.findOne({
        where: {
            noticeId: noticeId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(noticeId){
    return NoticeDislike.findAll({
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
    return NoticeDislike.update({where: {id: id}})
}

// destroy
exports.destroy = function destroy(id){
    return NoticeDislike.destroy({where: {id: id}})
}

// destroy noticeId userId
exports.destroyUserId = function destroy(noticeId, userId){
    return NoticeDislike.destroy({where: {noticeId: noticeId, userId: userId}})
}