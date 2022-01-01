const FreeLike = require('../models').FreeLike;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return FreeLike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return FreeLike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return FreeLike.findAll({
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
    return FreeLike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return FreeLike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destoryUserId = function destroy(articleId, userId){
    return FreeLike.destroy({where: {articleId: articleId, userId: userId}})
}