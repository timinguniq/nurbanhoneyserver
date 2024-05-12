const Information = require('../models').information;

// 글을 id로 갯수 가져오기
exports.readForFlag = function read(flag){
    return Information.findOne({
        attributes: ['content'],
        where: {
            flag: flag,
        }
    })
}