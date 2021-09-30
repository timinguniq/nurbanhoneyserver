const User = require('../models').User;

exports.create = function create(email, password){
    return User.create({
        id: 0,
        email: email,
        password: password,
        lastLoginAt: Date.now()
    })
/*
    id: {
      email: {
      password: {
      thumbnail: {
      nickname: {
      description: {
      insignia: {
      lastLoginAt: {
  }*/
}

exports.read = function read(eamil){
    return User.findOne({
        where: {
            email: email
        }
    })
}
  
exports.update = function update(thumbnail, nickanme, description, insignia){
    return User.update({thumbnail: thumbnail, nickname: nickanme, description: description, insignia: insignia}, {where: {id: id}})

}

exports.destory = function destory(id){
    return User.destroy({where: {id: id}})
}  