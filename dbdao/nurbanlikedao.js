const NurbanLike = require('../models').nurban_like;
const { sequelize } = require('../models');

// create
exports.create = function create(articleId, userId){
    return NurbanLike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(articleId, userId){
    return NurbanLike.findOne({
        where: {
            articleId: articleId,
            userId: userId
        }
    });
}

// read count
exports.readCount = function read(articleId){
    return NurbanLike.findAll({
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
    return NurbanLike.update({where: {id: id}})
}

// destory
exports.destory = function destory(id){
    return NurbanLike.destroy({where: {id: id}})
}

// destroy articleId userId
exports.destoryUserId = function destroy(articleId, userId){
    return NurbanLike.destroy({where: {articleId: articleId, userId: userId}})
}