const User = require('../models').User;

exports.create = function create(loginType, email, password){
    return User.create({
        id: 0,
        loginType: loginType,
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

exports.read = function read(inputEamil){
    return User.findOne({
        where: {
            email: inputEamil
        }
    })
}
  
// User content 업데이트
exports.update = function update(id, thumbnail, nickanme, description, insignia){
    return User.update({thumbnail: thumbnail, nickname: nickanme, description: description, insignia: insignia}, {where: {id: id}})
}

// User LastLoginAt만 업데이트
exports.updateLastTime = function update(id){
    return User.update({lastLoginAt: Date.now()}, {where: {id: id}})
}

exports.destory = function destory(id){
    return User.destroy({where: {id: id}})
}  