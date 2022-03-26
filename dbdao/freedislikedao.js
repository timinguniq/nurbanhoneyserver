const FreeDislike = require('../models').free_dislike;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return FreeDislike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return FreeDislike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return FreeDislike.findAll({
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
    return FreeDislike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return FreeDislike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destoryUserId = function destroy(articleId, userId){
    return FreeDislike.destroy({where: {articleId: articleId, userId: userId}})
}