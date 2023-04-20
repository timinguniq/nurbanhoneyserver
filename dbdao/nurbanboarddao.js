const NurbanBoard = require('../models').nurbanboard;
const User = require('../models').user;
const { Op } = require("sequelize");
const { sequelize } = require('../models');
const constObj = require('../config/const');

exports.create = function create(uuid, thumbnail, title, lossCut, content, userId){
    return NurbanBoard.create({
        id: 0,
        uuid: uuid,
        thumbnail: thumbnail,
        title: title,
        lossCut: lossCut,
        content: content,
        userId: userId
    })
/*
    id: {
      thumbanil: {
      title: {
      content: {
      count: {
      commentCount: {
      likeCount: {
      dislikeCount: {
      userId: {    
  }*/
}

// 글 id로 검색
/* 예제 코드로 남겨놓음
exports.readForId = function read(id){
    return NurbanBoard.findOne({
        where: {
            id: id 
        }
    })
}
*/

// 글 id로 검색
exports.readForId = function read(id){
    return NurbanBoard.findOne({
        include:[
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'key', 'badge', 'nickname']}
        ],
        where: {
            id: id
        }
    })
}
 
// 글 userId로 검색
exports.readForUserId = function read(userId, offset = 0, limit = 10){
    return NurbanBoard.findAll({
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'createdAt'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            userId: userId,
        },
        order: [['id', 'DESC']]
    })
}

// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.read = function read(articleId = 0, limit = 10){
    return NurbanBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']},
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
              [Op.lte]: articleId // use greater than operator to select records with id > specificId
            }
          },
    })
}

// userId에 따라 갯수 확인하는 메소드
exports.readCountForUserId = function read(userId){
    return NurbanBoard.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// 조회수 순으로 데이터 가져오기
exports.readCount = function read(articleId = 0, limit = 10){
    return NurbanBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            }
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    });
}

// 좋아요 순으로 데이터 가져오기
exports.readLikeCount = function read(articleId = 0, limit = 10){
    return NurbanBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            }
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    });
}

// 랭크 생성을 위한 데이터 가져오기
exports.readForRank = function read(){
    return NurbanBoard.findAll({
        attributes: [[sequelize.fn('SUM', sequelize.col('lossCut')), 'sumLossCut'],
                    [sequelize.fn('SUM', sequelize.col('likeCount')), 'sumLikeCount'], 'userId'],
        where: {
            likeCount: {
                [Op.gte]: constObj.baseLikeCount
            },
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            }
        },
        offset: 0,
        limit: 5,
        order: [['lossCut', 'DESC'], ['id', 'DESC']],
        group: 'userId'
    });
}

// 인기게시판 검색 메소드 (조회수, 좋아요 순으로 데이터 가져오기)
exports.readPopular = function read(articleId = 0, limit = 10){
    return NurbanBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'count', 'commentCount'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            }
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['likeCount', 'DESC'], ['id', 'DESC']]
    });
}

// uuid로 글 검색
exports.readForUuid = function read(uuid){
    return NurbanBoard.findOne({
        where: {
            uuid: uuid
        }
    })
}

// NurbanBoard content 업데이트
exports.updateContent = function update(id, thumbnail, title, lossCut, content){
    return NurbanBoard.update({thumbnail: thumbnail, title: title, lossCut: lossCut, content: content}, {where: {id: id}})
}

// NurbanBoard count 업데이트
exports.updateCount = function update(id, count){
    return NurbanBoard.update({count: count}, {where: {id: id}})
}

// NurbanBoard commentCount 업데이트
exports.updateCommentCount = function update(id, commentCount){
    return NurbanBoard.update({commentCount: commentCount}, {where: {id: id}})
}

// NurbanBoard likeCount 업데이트
exports.updateLikeCount = function update(id, likeCount){
    return NurbanBoard.update({likeCount: likeCount}, {where: {id: id}})
}

// NurbanBoard dislikeCount 업데이트
exports.updateDislikeCount = function update(id, dislikeCount){
    return NurbanBoard.update({dislikeCount: dislikeCount}, {where: {id: id}})
}

// NurbanBoard reflectLossCut 업데이트
exports.updateReflectLossCut = function update(id, reflectLossCut){
    return NurbanBoard.update({reflectLossCut: reflectLossCut}, {where: {id: id}})
}

// 글 삭제
exports.destory = function destory(id){
    return NurbanBoard.destroy({where: {id: id}})
}