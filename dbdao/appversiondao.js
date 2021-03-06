const Appversion = require('../models').appversion;

exports.create = function create(version, update){
    return Appversion.create({
        id: 0,
        appversion: version,
        isUpdate: update
    })
    /*
    .then((result) => {
        console.log("저장 성공: ", result);
    })
    .catch((err) => {
        console.log("저장 Error: ", err);
    });
    */ 
  }

exports.read = function read(){
    return Appversion.findOne({
        order: [['id', 'DESC']],
    })
    /* 
    .then((result) => {
        //console.log("조회 성공 1: ", result);
        //console.log("조회 성공 1 id: ", result.dataValues.id);
        })
    .catch((err) => {
        
    }
    */

    /*
    //전체 조회
    Users.findAll({attributes: ['id', 'email', 'password', 'name', 'phone', "createdAt", "updatedAt"]})
        .then((result) => {
            console.log("조회 성공 2: ", result);
            for(var i = 0 ; i < result.length ; i++){
                console.log(`id: ${result[i].dataValues.id}`);  
            }
        })
        .catch((err) => {
            console.log("조회 Error: ", err);
        })
    */
    }
  
exports.update = function update(id, version, update){
    return Appversion.update({appversion: version, isUpdate: update}, {where: {id: id}})
    /*
    .then((result) => {
        console.log("수정 성공: ", result);
    })
    .catch((err) => {
        console.log("수정 Error: ", err);
    })
    */
}

exports.destory = function destory(id){
    return Appversion.destroy({where: {id: id}})
    /*
    .then((result) => {
        console.log("삭제 성공: ", result);
    })
    .catch((err) => {
        console.log("삭제 Error: ", err);
    })
    */
}  