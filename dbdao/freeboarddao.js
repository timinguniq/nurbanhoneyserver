const FreeBoard = require('../models').freeboard;
const User = require('../models').user;
const { Op } = require("sequelize");
const { sequelize } = require('../models');
const constObj = require('../config/const');

exports.create = function create(uuid, thumbnail, title, content, userId){
    return FreeBoard.create({
        id: 0,
        uuid: uuid,
        thumbnail: thumbnail,
        title: title,
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
    return FreeBoard.findOne({
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
    return FreeBoard.findAll({
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'createdAt'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            userId: userId 
        },
        order: [['id', 'DESC']]
    })
}

// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.read = function read(articleId = -1, limit = 10){
    return articleId == -1 ? FreeBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
                [Op.gte]: articleId // use greater than operator to select records with id > specificId
            }
          },
    })
    : FreeBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
                [Op.lte]: articleId // use greater than operator to select records with id > specificId
            }
          },
    });
}

// userId에 따라 갯수 확인하는 메소드
exports.readCountForUserId = function read(userId){
    return FreeBoard.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// 조회수 순으로 데이터 가져오기
exports.readCount = function read(articleId = -1, limit = 10){
    return articleId == -1 ? FreeBoard.findAll({
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
    })
    : FreeBoard.findAll({
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
                [Op.lte]: articleId
            }
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    });
}

// 좋아요 순으로 데이터 가져오기
exports.readLikeCount = function read(articleId = -1, limit = 10){
    return articleId == -1 ? FreeBoard.findAll({
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
    })
    : FreeBoard.findAll({
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
                [Op.lte]: articleId
            }
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    });
}

// 인기게시판 검색 메소드 (조회수, 좋아요 순으로 데이터 가져오기)
exports.readPopular = function read(articleId = 0, limit = 10){
    return FreeBoard.findAll({
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

// FreeBoard content 업데이트
exports.updateContent = function update(id, thumbnail, title, content){
    return FreeBoard.update({thumbnail: thumbnail, title: title, content: content}, {where: {id: id}})
}

// FreeBoard count 업데이트
exports.updateCount = function update(id, count){
    return FreeBoard.update({count: count}, {where: {id: id}})
}

// FreeBoard commentCount 업데이트
exports.updateCommentCount = function update(id, commentCount){
    return FreeBoard.update({commentCount: commentCount}, {where: {id: id}})
}

// FreeBoard likeCount 업데이트
exports.updateLikeCount = function update(id, likeCount){
    return FreeBoard.update({likeCount: likeCount}, {where: {id: id}})
}

// FreeBoard dislikeCount 업데이트
exports.updateDislikeCount = function update(id, dislikeCount){
    return FreeBoard.update({dislikeCount: dislikeCount}, {where: {id: id}})
}

// 글 삭제
exports.destory = function destory(id){
    return FreeBoard.destroy({where: {id: id}})
} 
