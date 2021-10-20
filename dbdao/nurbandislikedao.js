const NurbanDislike = require('../models').NurbanDislike;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return NurbanDislike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return NurbanDislike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return NurbanDislike.findAll({
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
    return NurbanDislike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return NurbanDislike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destoryUserId = function destroy(articleId, userId){
    return NurbanDislike.destroy({where: {articleId: articleId, userId: userId}})
}