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
  
// User badge 업데이트
exports.updateBadge = function update(key, badge){
    return User.update({badge: badge}, {where: {key: key}})
}

// User nickname 업데이트
exports.updateNickname = function update(key, nickanme){
    return User.update({nickname: nickanme}, {where: {key: key}})
}

// User description 업데이트
exports.updateDescription = function update(key, description){
    return User.update({description: description}, {where: {key: key}})
}

// User insigniaShow 업데이트
exports.updateInsigniaShow = function update(key, insigniaShow){
    return User.update({insigniaShow: insigniaShow}, {where: {key: key}})    
}

// User insigniaOwn 업데이트
exports.updateInsigniaOwn = function update(key, insigniaOwn){
    return User.update({insigniaOwn: insigniaOwn}, {where: {key: key}})    
}

// User LastLoginAt만 업데이트
exports.updateLastTime = function update(id){
    return User.update({lastLoginAt: Date.now()}, {where: {id: id}})
}

exports.destory = function destory(id){
    return User.destroy({where: {id: id}})
}  