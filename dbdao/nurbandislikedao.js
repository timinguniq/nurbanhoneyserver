const NurbanDislike = require('../models').NurbanDislike;

// create
exports.create = function create(articleId, userId){
    return NurbanDislike.create({
        id: 0,
        articleId: articleId,
        userId: userId
    })
}
 
// read
exports.read = function read(userId){
    return NurbanDislike.findOne({
        where: {
            userId: userId
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

// destroy userId
exports.destoryUserId = function destroy(userId){
    return NurbanDislike.destroy({where: {userId: userId}})
}