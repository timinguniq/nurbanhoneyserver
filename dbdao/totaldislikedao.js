const TotalDislike = require('../models').total_dislike;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return TotalDislike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return TotalDislike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return TotalDislike.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            articleId: articleId
        }
    });
}

// update 
exports.update = function update(id){
    return TotalDislike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return TotalDislike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destoryUserId = function destroy(articleId, userId){
    return TotalDislike.destroy({where: {articleId: articleId, userId: userId}})
}

// userId로 글 삭제
exports.destoryWithdrawalForUserId = function destory(userId){
    return TotalDislike.destory({
        where: {userId: userId},
        truncate: true
    })
}