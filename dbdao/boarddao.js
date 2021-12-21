const Board = require('../models').Board;

exports.create = function create(name, address){
    return Board.create({
        id: 0,
        name: name,
        address: address
    })
  }

exports.read = function read(){
    return Board.findAll({
    })
}
  
exports.update = function update(id, name, address){
    return Board.update({name: name, address: address}, {where: {id: id}})
}

exports.destory = function destory(id){
    return Board.destroy({where: {id: id}})
}  