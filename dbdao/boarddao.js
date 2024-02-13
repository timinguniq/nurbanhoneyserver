const Board = require('../models').board;

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

exports.destroy = function destroy(id){
    return Board.destroy({where: {id: id}})
}