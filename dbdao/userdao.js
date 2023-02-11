const User = require('../models').user;
const Insignia = require('../models').insignia;
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
    return User.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: Insignia, attributes: [['id', 'userId'], ['insignia', 'insigniaShow']]}
        ],
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

// User Point 업데이트
exports.updatePoint = function update(key, point){
    return User.update({point: point}, {where: {key: key}})
}

// User Edit 모드에서 업데이트 통신(닉네임, 설명, 보여주는 휘장)
exports.updateEdit = function update(key, nickname, description){
    return User.update({nickname: nickname, description: description}, {where: {key: key}})
}

// User bookmark 업데이트
exports.updateBookmark = function update(key, bookmark){
    return User.update({bookmark: bookmark}, {where: {key: key}})
}

// User totalLossCut 업데이트
exports.updateTotalLossCut = function update(key, totalLossCut){
    return User.update({totalLossCut: totalLossCut}, {where: {key: key}})    
}

// User LastLoginAt만 업데이트
exports.updateLastTime = function update(id){
    return User.update({lastLoginAt: Date.now()}, {where: {id: id}})
}

exports.destory = function destory(id){
    return User.destroy({where: {id: id}})
}