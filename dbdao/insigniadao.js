const Insignia = require('../models').insignia;

// create
exports.create = function create(insignia, userId){
    return Insignia.findOrCreate({
        where: {insignia: insignia, userId: userId},
        defaults: {
            id: 0,
            insignia: insignia,
            userId: userId,
        }
    }).then((insigniaRow, isCreated) => {
        if(isCreated){            
            //insignia created
            console.log('create insignia', insigniaRow);
        }
    });
}
 
// read all insignia
exports.readOwn = function read(userId){
    return Insignia.findAll({
        where: {
            userId: userId
        }
    });
}

// read shonw insignia
exports.readShown = function read(userId){
    return Insignia.findAll({
        where: {
            isShown: true,
            userId: userId
        }
    });
}

// update 
exports.updateSetShown = function update(insignia, userId){
    return Insignia.update({isShown: true}, {where: {insignia: insignia, userId: userId}})
}

// update 
exports.updateSetUnShown = function update(insignia, userId){
    return Insignia.update({isShown: false}, {where: {insignia: insignia, userId: userId}})
}

// destroy
exports.destroy = function destroy(insignia, userId){
    return Insignia.destroy({where: {insignia: insignia, userId: userId}})
}
