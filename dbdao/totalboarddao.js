const TotalBoard = require('../models').totalboard;
const User = require('../models').user;
const { Op } = require("sequelize");
const { sequelize } = require('../models');
const constObj = require('../config/const');

exports.create = function create(uuid, board, thumbnail, title, lossCut, content, userId){
    return TotalBoard.create({
        id: 0,
        board: board,
        uuid: uuid,
        thumbnail: thumbnail,
        title: title,
        lossCut: lossCut,
        content: content,
        userId: userId
    })
}

// 글 id로 검색
exports.readForId = function read(id){
    return TotalBoard.findOne({
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
    return TotalBoard.findAll({
        attributes: ['id', 'board', 'thumbnail', 'title', 'commentCount', 'createdAt'],
        offset: Number(offset),
        limit: Number(limit),
        where: {
            userId: userId,
        },
        order: [['id', 'DESC']]
    })
}

// userId에 따라 갯수 확인하는 메소드
exports.readCountForUserId = function read(userId){
    return TotalBoard.findAll({
        attributes: [
            [sequelize.fn('COUNT', sequelize.col('id')), 'n_ids']
        ],
        where: {
            userId: userId
        }
    });
}

// BoardAll
// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readBoardAll = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']},
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
              [Op.gte]: articleId // use greater than operator to select records with id > specificId
            },
          },
    })
    : TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']},
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
              [Op.lte]: articleId // use greater than operator to select records with id > specificId
            },
          },
    });
}

// BoardAll
// 조회수 순으로 데이터 가져오기
exports.readCountBoardAll = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            },
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.lte]: articleId
            },
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    });
}

// BoardAll
// 좋아요 순으로 데이터 가져오기
exports.readLikeCountBoardAll = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            },
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'content', 'commentCount', 'likeCount', 'createdAt'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.lte]: articleId
            },
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
}

// NubanBoard
// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readNurban = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']},
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
              [Op.gte]: articleId // use greater than operator to select records with id > specificId
            },
            board: constObj.nurban,
          },
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.nurban,
          },
    });
}

// Nurban
// 조회수 순으로 데이터 가져오기
exports.readCountNurban = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
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
            },
            board: constObj.nurban,
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.nurban,
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    });
}

// Nurban
// 좋아요 순으로 데이터 가져오기
exports.readLikeCountNurban = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
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
            },
            board: constObj.nurban,
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.nurban,
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
}

// FreeBoard
// 글을 id로 갯수 가져오기(썸네일, 제목, 댓글 개수)
exports.readFree = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']},
        ],
        attributes: ['id', 'thumbnail', 'title', 'commentCount', 'likeCount', 'createdAt'],
        limit: Number(limit),
        order: [['id', 'DESC']],
        where: {
            id: {
              [Op.gte]: articleId // use greater than operator to select records with id > specificId
            },
            board: constObj.free,
          },
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.free,
          },
    });
}

// Free
// 조회수 순으로 데이터 가져오기
exports.readCountFree = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
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
            },
            board: constObj.free,
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.free,
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['id', 'DESC']]
    });
}

// Free
// 좋아요 순으로 데이터 가져오기
exports.readLikeCountFree = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
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
            },
            board: constObj.free,
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
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
            },
            board: constObj.free,
        },
        limit: Number(limit),
        order: [['likeCount', 'DESC'], ['id', 'DESC']]
    })
}

// 랭크 생성을 위한 데이터 가져오기
exports.readForRank = function read(){
    return TotalBoard.findAll({
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
            },
            board: constObj.nurban,
        },
        offset: 0,
        limit: 5,
        order: [['lossCut', 'DESC'], ['id', 'DESC']],
        group: 'userId'
    });
}

// 인기게시판 검색 메소드 (조회수, 좋아요 순으로 데이터 가져오기)
exports.readPopular = function read(articleId = -1, limit = 10){
    return articleId == -1 ? TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'count', 'commentCount'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.gte]: articleId
            },
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['likeCount', 'DESC'], ['id', 'DESC']]
    })
    : TotalBoard.findAll({
        include: [
            // ['id', 'userId] === id AS userId
            {model: User, attributes: [['id', 'userId'], 'badge', 'nickname']}
        ],
        attributes: ['id', 'board', 'thumbnail', 'title', 'count', 'commentCount'],
        where: {
            createdAt: {
                // createdAt < [timestamp] AND createdAt > [timestamp]
                [Op.lte]: new Date(),
                [Op.gte]: new Date(new Date() - 1000 * 60 * 60 * 24 * 30)
            },
            id: {
                [Op.lte]: articleId
            },
        },
        limit: Number(limit),
        order: [['count', 'DESC'], ['likeCount', 'DESC'], ['id', 'DESC']]
    });
}

// uuid로 글 검색
exports.readForUuid = function read(uuid){
    return TotalBoard.findOne({
        where: {
            uuid: uuid,
        }
    })
}

// TotalBoard content 업데이트
exports.updateContent = function update(id, thumbnail, title, lossCut, content){
    return TotalBoard.update({thumbnail: thumbnail, title: title, lossCut: lossCut, content: content}, {where: {id: id}})
}

// TotalBoard count 업데이트
exports.updateCount = function update(id, count){
    return TotalBoard.update({count: count}, {where: {id: id}})
}

// TotalBoard commentCount 업데이트
exports.updateCommentCount = function update(id, commentCount){
    return TotalBoard.update({commentCount: commentCount}, {where: {id: id}})
}

// TotalBoard likeCount 업데이트
exports.updateLikeCount = function update(id, likeCount){
    return TotalBoard.update({likeCount: likeCount}, {where: {id: id}})
}

// TotalBoard dislikeCount 업데이트
exports.updateDislikeCount = function update(id, dislikeCount){
    return TotalBoard.update({dislikeCount: dislikeCount}, {where: {id: id}})
}

// TotalBoard reflectLossCut 업데이트
exports.updateReflectLossCut = function update(id, reflectLossCut){
    return TotalBoard.update({reflectLossCut: reflectLossCut}, {where: {id: id}})
}

// 글 삭제
exports.destory = function destory(id){
    return TotalBoard.destroy({where: {id: id}})
}
