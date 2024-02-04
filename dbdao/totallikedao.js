const TotalLike = require('../models').total_like;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return TotalLike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return TotalLike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return TotalLike.findAll({
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
    return TotalLike.update({where: {id: id}})
}

// destroy
exports.destroy = function destroy(id){
    return TotalLike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destroyUserId = function destroy(articleId, userId){
    return TotalLike.destroy({where: {articleId: articleId, userId: userId}})
}

// userId로 글 삭제
exports.destroyWithdrawalForUserId = function destroy(userId){
    return TotalLike.destroy({
        where: {userId: userId},
        truncate: true
    })
}