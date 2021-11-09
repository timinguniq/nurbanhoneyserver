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

// User Point 업데이트
exports.updatePoint = function update(key, point){
    return User.update({point: point}, {where: {key: key}})
}

// User Edit 모드에서 업데이트 통신(닉네임, 설명, 보여주는 휘장)
exports.updateEdit = function update(key, nickname, description, insigniaShow){
    return User.update({nickname: nickname, description: description, insigniaShow: insigniaShow}, {where: {key: key}})
}

// User insigniaOwn 업데이트
exports.updateInsigniaOwn = function update(key, insigniaOwn){
    return User.update({insigniaOwn: insigniaOwn}, {where: {key: key}})    
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