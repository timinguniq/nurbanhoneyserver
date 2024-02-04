var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
const insigniaDao = require('../dbdao/insigniadao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractuserid');
let settingBadge = require('../utils/settingbadge');
let settingInsignia = require('../utils/settinginsignia');
let inputErrorHandler = require('../utils/inputerrorhandler');
let settingInsigniaOwn = require('../utils/settinginsigniaown');
let settingInsigniaShown = require('../utils/settinginsigniashown');
const constObj = require('../config/const');

const totalBoardDao = require('../dbdao/totalboarddao');
const totalCommentDao = require('../dbdao/totalcommentdao');
const totalLikeDao = require('../dbdao/totallikedao');
const totalDislikeDao = require('../dbdao/totaldislikedao');
const rankDao = require('../dbdao/rankdao');

// 프로필 관련 통신
// 유저 데이터 받아오는 통신
router.get('/', async (req, res) => {
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = await extractUserId(key);

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
        let totalLossCut = result.totalLossCut;

        //let nurbanBoardResult = await nurbanBoardDao.readCountForUserId(id);        
        //let myArticleCount = nurbanBoardResult[0].dataValues.n_ids;

        //let nurbanCommentResult = await nurbanCommentDao.readCountForUserId(id);
        //let myCommentCount = nurbanCommentResult[0].dataValues.n_ids;

        let totalBoardResult = await totalBoardDao.readCountForUserId(id);        
        let myArticleCount = totalBoardResult[0].dataValues.n_ids;

        let totalCommentResult = await totalCommentDao.readCountForUserId(id);
        let myCommentCount = totalCommentResult[0].dataValues.n_ids;


        // point에 따른 badge 셋팅
        if(!await settingBadge(key, point)){
            console.log("settingBadge error");
        }

        // 휘장 획득하는 코드
        if(!await settingInsignia(userId, point, totalLossCut, myArticleCount, myCommentCount)){
            console.log("settingInsignia error");
        }

        var insigniaOwnList = await settingInsigniaOwn(id);
        var insigniaShownList = await settingInsigniaShown(id);       
        
        let nameList = ["id", "loginType", "badge", "nickname", "description", "point",
         "insigniaShow", "insigniaOwn", "myArticleCount", "myCommentCount"];
        let valueList = [id, loginType, badge, nickname, description, point, 
            insigniaShownList, insigniaOwnList ,myArticleCount, myCommentCount];
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

    // TODO : 나중에 어플에서 어떤 형식으로 오는지 확인하고 변환해야 될듯 
    // 지금은 '['A', 'B']' 이런 배열 형태의 스트링을 인풋을 받는 것으로 처리하고 있다.
    console.log('insigniaShow : ', insigniaShow);
    let insigniaArray = [];
    insigniaArray = insigniaShow.replace('[', '').replace(']', '').split(',');
    insigniaArray = insigniaArray.map(element => {
        return element.replaceAll('"', '').trim();
    });
    console.log('insigniaArray : ', insigniaArray);
    //
    let token = req.headers.authorization?.replace('Bearer ', '');   

    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [nickname, description];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");
        res.status(400).json(resultObject);
        return res.end();
    }

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = await extractUserId(key);

    try{
        let result = await userDao.updateEdit(key, nickname, description);

        // 소유한 전체 휘장을 가져와서 안보이게 처리
        let insigniaAll = await insigniaDao.readOwn(userId);
        for(let i in insigniaAll){
            await insigniaDao.updateSetUnShown(insigniaAll[i].dataValues.insignia, userId);
        }
        // 여기까지

        // input으로 들어온 휘장 업데이트하기!
        let insigniaUpdateResult = '';
        for(let key in insigniaArray) {
            console.log('insigniaShow 12 :', insigniaArray[key]);
            console.log('insigniaShow 12 userId : ', userId);
            insigniaUpdateResult = await insigniaDao.updateSetShown(insigniaArray[key], userId);
            console.log('insigniaUpdateResult : ', insigniaUpdateResult[0]);
        }
        // 여기까지
        
        // result 1이면 성공 0이면 실패
        console.log(`patch result : ${result}`)
        if(result[0] === 1){
            resultObject = createJson.result("profile_updated");          
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("profile_updated_fail");
            res.status(700).json(resultObject);
        }
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
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = await extractUserId(key);

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
        //let nurbanBoardResult = await nurbanBoardDao.readForUserId(userId, offset, limit);
        //console.log("nurbanBoardResult", nurbanBoardResult);
        // TODO 자유게시판 내가 쓴 글 불러오기
        //let freeBoardResult = await freeBoardDao.readForUserId(userId, offset, limit);
        //console.log("freeBoardResult", freeBoardResult);

        let totalBoardResult = await totalBoardDao.readForUserId(userId, offset, limit);
        console.log("totalBoardResult", totalBoardResult);


        let contentObjectList = [];

        // 너반꿀 게시판
        //for(var i = 0 ; i < nurbanBoardResult.length ; i++){
        //    nurbanBoardResult[i].dataValues.board = constObj.nurbanboard;
        //    contentObjectList.push(nurbanBoardResult[i].dataValues);
        //}

        // 자유게시판
        //for(var i = 0 ; i < freeBoardResult.length ; i++){
        //    freeBoardResult[i].dataValues.board = constObj.freeboard;
        //    contentObjectList.push(freeBoardResult[i].dataValues);
        //}

        for(var i = 0 ; i < totalBoardResult.length ; i++){
            //nurbanBoardResult[i].dataValues.board = constObj.nurbanboard;
            contentObjectList.push(totalBoardResult[i].dataValues);
        }

        // array sort 내림차순(최신께 위로)
        //contentObjectList.sort((a, b) => {
        //    if(a.createdAt > b.createdAt) return -1;
        //    if(a.createdAt === b.createdAt) return 0;
        //    if(a.createdAt < b.createdAt) return 1;
        //});

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
    let offset = req.query.offset;
    let limit = req.query.limit;
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = await extractUserId(key);

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
        //let nurbanCommentResult = await nurbanCommentDao.readForUserId(userId, offset, limit);
        //console.log("nurbanCommentResult", nurbanCommentResult);
        // TODO 자유게시판 내가 쓴 글 불러오기
        //let freeCommentResult = await freeCommentDao.readForUserId(userId, offset, limit);
        //console.log("freeCommentResult", freeCommentResult);
 
        let totalCommentResult = await totalCommentDao.readForUserId(userId, offset, limit);
        console.log("totalCommentResult", totalCommentResult);

        let contentObjectList = [];

        // 너반꿀 게시판
        //for(var i = 0 ; i < nurbanCommentResult.length ; i++){
        //    nurbanCommentResult[i].dataValues.board = constObj.nurbanboard;
        //    contentObjectList.push(nurbanCommentResult[i].dataValues);
        //}

        // 자유게시판 
        //for(var i = 0 ; i < freeCommentResult.length ; i++){
        //    freeCommentResult[i].dataValues.board = constObj.freeboard;
        //    contentObjectList.push(freeCommentResult[i].dataValues);
        //}

        for(var i = 0 ; i < totalCommentResult.length ; i++){
            //nurbanCommentResult[i].dataValues.board = constObj.nurbanboard;
            contentObjectList.push(totalCommentResult[i].dataValues);
        }

        // array sort 내림차순(최신께 위로)
        //contentObjectList.sort((a, b) => {
        //    if(a.createdAt > b.createdAt) return -1;
        //    if(a.createdAt === b.createdAt) return 0;
        //    if(a.createdAt < b.createdAt) return 1;
        //});

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

// 회원탈퇴
router.delete('/withdrawal', async (req, res) => {
    let id = req.body.id;
 
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
        let result = await userDao.destroy(id);
        // result 1이면 성공 0이면 실패
        // TODO: 관련 글들 삭제 관련 댓글 삭제
        let articleDeleteResult = await totalBoardDao.destroyForUserId(id);
        let commentDeleteResult = await totalCommentDao.destroyForUserId(id);
        let likeDeleteResult = await totalLikeDao.destroyWithdrawalForUserId(id);
        let dislikeDeleteResult = await totalDislikeDao.destroyWithdrawalForUserId(id);
        let rankDeleteResult = await rankDao.destroyForUserId(id);        

        console.log('delete123 articleDeleteResult', articleDeleteResult);
        console.log('delete123 commentDeleteResult', commentDeleteResult);
        console.log('delete123 likeDeleteResult', likeDeleteResult);
        console.log('delete123 dislikeDeleteResult', dislikeDeleteResult);
        console.log('delete123 rnakDeleteResult', rankDeleteResult);

        if(result === 1){
            resultObject = createJson.result("profile_withdrawal");
            res.status(200).json(resultObject);
        }else{
            resultObject = createJson.result("profile_withdrawal_fail");
            res.status(700).json(resultObject);
        }
    }catch(err){
        console.log(`withdrawal err : ${err}`)
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
})

// 북마크 데이터 가져오는 메소드
// TODO : 북마크 임시로 해놓은 거 나중에 테스트 
router.get('/bookmark', async (req, res) => {
    let contentObject = new Object()
    let resultObject = new Object();

    //TODO: 여기서 부터 시작 해 됨.
    let token = req.headers.authorization?.replace('Bearer ', '');

    // 토큰에서 키 값 추출
    let key = extractKey(token);
    // 키에서 userId 값 추출
    let userId = await extractUserId(key);

    try{
        let result = await userDao.read(key);
        console.log("result", result);
        let id = result.id;
        let bookmark = result.bookmark;

        // string으로 안 가고 array로 가게 수정하는 코드
        bookmark = JSON.parse(bookmark);
        if(bookmark === ""){
            bookmark = [];
        }
        
        let nameList = ["id", "bookmark"];
        let valueList = [id, bookmark];
        resultObject = createJson.multi(nameList, valueList);
        res.status(200).json(resultObject);
    }catch(err){
        console.log("err", err);
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
})


module.exports = router;