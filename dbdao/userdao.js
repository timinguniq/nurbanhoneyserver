const User = require('../models').User;
const { sequelize } = require('../models');

exports.create = function create(loginType, key, password, nickname){
    return User.create({
        id: 0,
        loginType: loginType,
        key: key,
        password: password,
        nickname: nickname,
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

exports.read = function read(inputKey){
    return User.findOne({
        where: {
            key: inputKey
        }
    });
}

exports.readCount = function read(){
    return User.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ] 
    });
}
  
// User content 업데이트
exports.update = function update(id, thumbnail, nickanme, description, insignia){
    return User.update({thumbnail: thumbnail, nickname: nickanme, description: description, insignia: insignia}, {where: {id: id}})
}

// User profile 업데이트
exports.updateProfile = function update(key, profile){
    return User.update({profile: profile}, {where: {key: key}})
}

// User nickname 업데이트
exports.updateNickname = function update(key, nickanme){
    return User.update({nickname: nickanme}, {where: {key: key}})
}

// User description 업데이트
exports.updateDescription = function update(key, description){
    return User.update({description: description}, {where: {key: key}})
}


// User LastLoginAt만 업데이트
exports.updateLastTime = function update(id){
    return User.update({lastLoginAt: Date.now()}, {where: {id: id}})
}

exports.destory = function destory(id){
    return User.destroy({where: {id: id}})
}  