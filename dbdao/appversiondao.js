const Appversion = require('../models').appversion;

exports.create = function create(version, update){
    return Appversion.create({
        id: 0,
        appversion: version,
        isUpdate: update
    })
  }

exports.read = function read(){
    return Appversion.findOne({
        order: [['id', 'DESC']],
    })
}
  
exports.update = function update(id, version, update){
    return Appversion.update({appversion: version, isUpdate: update}, {where: {id: id}})
}

exports.destory = function destory(id){
    return Appversion.destroy({where: {id: id}})
}  