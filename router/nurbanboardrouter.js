const { application } = require('express');
var express = require('express');
var router = express.Router();
const nurbanboardDao = require('../dbdao/nurbanboarddao');
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var s3upload = require('../utils/s3upload');
var s3delete = require('../utils/s3delete');
let awsObj = require('../config/aws.js');
/*
exports.create = function create(thumbnail, title, content, userId){
    return NurbanBoard.create({
        id: 0,
        thumbnail: thumbnail,
        title: title,
        content: content,
        userId: userId
    })
*/ 

// 글 생성 
router.post('/', async (req, res) => {
    // TODO : thumbnail 처리 해야 됨.
    let thumbnail = req.body.thumbnail;
    let title = req.body.title;
    let content = req.body.content;
    let userId = '';

    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObject = new Object();
    let resultObject = new Object();
    // key 값으로 User 테이블의 id 값 받아오기
    try{
        let result = await userDao.read(key);
        userId = result.id;
    }catch(err){
        console.log(`userDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // 너반꿀 게시판 글 작성
    try{
        let result = await nurbanboardDao.create(thumbnail, title, content, userId);
        console.log(`create : ${result}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = ["ok", null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
    }catch(err){
        console.log(`create nurbanboardDao err : ${err}`);
        let resultObject = {};
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_create_result", contentObject);
    }
    res.json(resultObject);
});

// 글 상세 데이터 받아오는 메소드
router.get('/detail', async (req, res) => {
    let id = req.query.id;

    let articleCount = 0
    // id 값으로 데이터 읽기
    try{
        let result = await nurbanboardDao.readForId(id);
        let id = result.id;
        let thumbanil = result.thumbanil;
        let title = result.title;
        let content = result.content;
        let count = result.count;
        articleCount = count;
        let commentCount = result.commentCount;
        let likeCount = result.likeCount;
        let dislikeCount = result.dislikeCount;
        let updateAt = result.updateAt; 
        let profile = result.User.profile;
        let nickname = result.User.nickname;
        let insignia = result.User.insignia;

        let resultObject = {};
        let nameList = ["id", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "profile", "nickname", "insignia", "error"];
        let valueList = [id, thumbanil, title, content, count, commentCount, likeCount, dislikeCount, updateAt, 
                profile, nickname, insignia, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    }catch(err){
        let resultObject = {};
        let nameList = ["id", "thumbnail", "title", "content", "count", "commentCount", "likeCount", "dislikeCount", "updateAt", 
                "profile", "nickname", "insignia", "error"];
        let valueList = [null, null, null, null, null, null, null, null, null, 
                null, null, null, "article is not exist"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("nurbanboard_detail_result", contentObject);
        res.json(resultObject);
    }
  
    // 조회수 카운트 플러스하는 코드
    try{
        let result = await nurbanboardDao.updateCount(id, ++articleCount);
        console.log(`nurbanboard detail updateCount result : ${result}`);  
    }catch(err){
        console.log(`nurbanboard detail updateCount err : ${err}`);
    }

})

// 글 리스트 데이터 받아오는 메소드
router.get('/', async (req, res) => {
    let offset = req.query.offset;
    let limit = req.query.limit;

    let resultObject = new Object();
    // 썸네일, 제목, 댓글 개수
    try{
        let result = await nurbanboardDao.readCount(offset, limit);
        // 데이터 베이스 총 카운터 수
        let contentTotalCount = result.count
        // 데이터 리스트 오브젝트        
        let contentObjectArray = result.rows;
 
        console.log(`result.rows : ${result.rows}`);
        resultObject = createJson.one("nurbanboard_list_result", contentObjectArray);
    }catch(err){
        console.log(`err : ${err}`);
        let contentObject = new Object();
        contentObject.error = err;
        resultObject = createJson.one("nurbanboard_list_result", contentObject);
    }
    res.json(resultObject);
});

// 글 수정 관련 통신 메소드
router.patch('/', async (req, res) => {
    // TODO : 여기서부터 await 작업

    let id = req.query.id;
    // 나중에 thumbanil 처리해줘야됨.
    let thumbnail = req.query.thumbnail;
    let title = req.query.title;
    let content = req.query.content;
    
    try{
        let result = await nurbanboardDao.updateContent(id, thumbnail, title, content);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbanboard_revise_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`patch err : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbanboard_revise_result", contentObject);
        res.json(resultObject);
    }
});

// 글 삭제 관련 통신 메소드
router.delete('/', async (req, res) => {
    let id = req.query.id;

    try{
        let result = await nurbanboardDao.destory(id);
        // result 1이면 성공 0이면 실패
        console.log(`delete result : ${result}`)
        let nameList = ["result", "error"];
        let valueList = [result, null];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbanboard_delete_result", contentObject);
        res.json(resultObject);
    }catch(err){
        console.log(`delete err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        let contentObject = createJson.multi(nameList, valueList);
        let resultObject = createJson.one("nurbanboard_delete_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    // s3에 글 이미지 삭제하기
    s3delete(awsObj.s3nurbanboardname, id)
    
    /*        
    let s3 = new AWS.S3();
    var params = {  
        'Bucket' : awsObj.s3nurbanboardname, 
        'Key' : `${id}/` 
    };

    s3.deleteObject(params, (err, data) => {
        if (err){
            // error
            console.log(err, err.stack);
        } else{
            // deleted
            console.log(data);
        }     
    });
    */
});

// 글 관련 이미지 업로드
router.post('/upload/image', async (req, res) => {
    let imageFile = req.files;
    let articleId = req.body.id;
    
    let imageFileNameSize = JSON.stringify(imageFile[0].originalname).split('\\').length;
    let imageFileName = JSON.stringify(imageFile[0].originalname).split('\\')[imageFileNameSize-1];
    
    let bufferObj = JSON.parse(JSON.stringify(imageFile[0].buffer));
    let bodyBuffer = new Buffer.from(bufferObj.data);  

    // s3에 파일 업로드 하는 메소드
    let resultObject = s3upload(articleId, imageFileName, bodyBuffer);
    res.json(resultObject);

/*
    let s3 = new AWS.S3();
    let param = {
        'Bucket' : awsObj.s3nurbanboardname,
        'Key' : `${articleId}/${imageFileName}`,
        'ACL' : 'public-read',
        'Body' : bodyBuffer,
        'ContentType' : 'image/png'
    }

    s3.upload(param, (err, data) => {     
        if(err !== null){
            // 에러가 있음
            let nameList = ["result", "error"];
            let valueList = [null, err];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("nurbanboard_image_result", contentObject);
            res.json(resultObject);
        }else{
            // 에러가 없음
            let location = data.Location;
            let nameList = ["result", "error"];
            let valueList = [location, null];
            let contentObject = createJson.multi(nameList, valueList);
            let resultObject = createJson.one("nurbanboard_image_result", contentObject);
            res.json(resultObject);
        }
    });
    */
    
});

module.exports = router;