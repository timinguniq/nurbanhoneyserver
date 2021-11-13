var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let settingBadge = require('../utils/settingbadge');
let settingInsignia = require('../utils/settinginsignia');
let inputErrorHandler = require('../utils/inputerrorhandler');
const constObj = require('../config/const');

// 프로필 관련 통신
// 유저 데이터 받아오는 통신
router.get('/', async (req, res) => {
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);

    let contentObject = new Object();
    let resultObject = new Object();

    try{
        let result = await userDao.read(key);
        console.log("result", result);
        let id = result.id;
        let loginType = result.loginType;
        let badge = result.badge;
        let nickname = result.nickname;
        let description = result.description;
        let point = result.point;
        let insigniaShow = result.insigniaShow;
        let insigniaOwn = result.insigniaOwn;
        let totalLossCut = result.totalLossCut;

        // TODO : 현재는 너반꿀 게시판만 갯수를 가져오고 추후 자유게시판도 갯수 
        let nurbanBoardResult = await nurbanBoardDao.readCountForUserId(id);
        let myArticleNumber = nurbanBoardResult[0].dataValues.n_ids;

        // TODO : 현재는 너반꿀 게시판만 갯수를 가져오고 추후 자유게시판도 갯수 
        let nurbanCommentResult = await nurbanCommentDao.readCountForUserId(id);
        let myCommentNumber = nurbanCommentResult[0].dataValues.n_ids;
        
        // point에 따른 badge 셋팅
        if(!settingBadge(key, point)){
            console.log("settingBadge error");
        }

        // 휘장 획득하는 코드
        if(!settingInsignia(key, insigniaOwn, point, totalLossCut, myArticleNumber, myCommentNumber)){
            console.log("settingInsignia error");
        }

        let nameList = ["id", "loginType", "badge", "nickname", "description", "point", "insigniaShow", "insigniaOwn"];
        let valueList = [id, loginType, badge, nickname, description, point, insigniaShow, insigniaOwn];
        resultObject = createJson.multi(nameList, valueList);
        res.status(200).json(resultObject);
    }catch(err){
        console.log("err", err);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// edit 편집을 누르면 이루어지는 편집 통신
router.patch('/edit', async (req, res) => {
    let nickname = req.body.nickname;
    let description = req.body.description;
    let insigniaShow = req.body.insignia;
    let token = req.headers.token;
    
    console.log("insigniaShow : ", insigniaShow);

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [nickname, description, insigniaShow];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 테스트 코드
    key = "K-1962161281";

    try{
        let result = await userDao.updateEdit(key, nickname, description, insigniaShow);
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        resultObject = createJson.result(result[0]);
        res.status(200).json(resultObject);
    }catch(err){
        console.log(`patch err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

// 내가 작성한 글 리스트 보는 통신
router.get('/myarticle', async (req, res) => {
    let offset = req.query.offset;
    let limit = req.query.limit;
    let token = req.headers.token;

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = extractUserId(key);

    // 테스트 코드 나중에 삭제 해야됨
    userId = 1;

    let resultObject = new Object();

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [offset, limit];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 썸네일, 제목, 댓글 개수
    try{
        // 너반꿀 게시판에서 내가 쓴 글 불러오기
        let nurbanBoardResult = await nurbanBoardDao.readForUserId(userId, offset, limit);
        console.log("nurbanBoardResult", nurbanBoardResult);
        // TODO 자유게시판 내가 쓴 글 불러오기
        //let freeBoardResult = await nurbanBoardDao.readForUserId(userId, offset, limit);
        //console.log("freeBoardResult", freeBoardResult);

        let contentObjectList = [];

        // 너반꿀 게시판
        for(var i = 0 ; i < nurbanBoardResult.length ; i++){
            nurbanBoardResult[i].dataValues.flag = constObj.nurbanboard;
            contentObjectList.push(nurbanBoardResult[i].dataValues);
        }

        // 자유게시판 
        //for(var i = 0 ; i < freeBoardResult.length ; i++){
        //    freeBoardResult[i].dataValues.flag = constObj.nurbanboard;
        //    contentObjectList.push(freeBoardResult[i].dataValues);
        //}

        console.log("contentObjectArrayList", contentObjectList);

        //console.log(`result.rows : ${result.rows}`);
        //resultObject = createJson.one("nurbanboard_list_result", contentObjectList);
        res.status(200).json(contentObjectList);
    }catch(err){
        console.log(`err : ${err}`);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }

});

// 내가 작성한 댓글 리스트 보는 통신
router.get('/mycomment', async (req, res) => {

});

// 회원탈퇴
router.delete('/withdrawal', async (req, res) => {
    let id = req.query.id;
 
    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    try{
        let result = await userDao.destory(id);
        // result 1이면 성공 0이면 실패
        resultObject = createJson.result(result);
        res.status(200).json(resultObject);
    }catch(err){
        console.log(`withdrawal err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
})


module.exports = router;