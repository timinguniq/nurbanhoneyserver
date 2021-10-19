const NurbanLike = require('../models').NurbanLike;

// create
exports.create = function create(articleId, userId){
    return NurbanLike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(userId){
    return NurbanLike.findOne({
        where: {
            userId: userId
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

// destroy userId
exports.destoryUserId = function destroy(userId){
    return NurbanLike.destroy({where: {userId: userId}})
}