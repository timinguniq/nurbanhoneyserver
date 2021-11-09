var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
const nurbanBoardDao = require('../dbdao/nurbanboarddao');
const nurbanCommentDao = require('../dbdao/nurbancommentdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractUserId');
var s3upload = require('../utils/s3upload');
let settingBadge = require('../utils/settingbadge');
let settingInsignia = require('../utils/settinginsignia');
let inputErrorHandler = require('../utils/inputerrorhandler');
let awsObj = require('../config/aws.js');

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

        let nurbanBoardResult = await nurbanBoardDao.readCountForUserId(id);
        let myArticleNumber = nurbanBoardResult[0].dataValues.n_ids;

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

        let nameList = ["id", "loginType", "badge", "nickname", "description", "point", "insigniaShow", "insigniaOwn", "error"];
        let valueList = [id, loginType, badge, nickname, description, point, insigniaShow, insigniaOwn, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }catch(err){
        console.log("err", err);
        let nameList = ["id", "loginType", "badge", "nickname", "description", "point", "insigniaShow", "insigniaOwn", "error"];
        let valueList = [null, null, null, null, null, null, null, null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }
    res.json(resultObject);
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
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_edit_result", contentObject);
        res.json(resultObject);
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
        let nameList = ["result", "error"];
        let valueList = [result[0], null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_edit_result", contentObject);
    }catch(err){
        console.log(`patch err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_edit_result", contentObject);
    }
    res.json(resultObject);
});

// 내가 작성한 글 리스트 보는 통신
router.get('/myArticle', async (req, res) => {

})

// 회원탈퇴
router.delete('/withdrawal', async (req, res) => {
    let id = req.query.id;
 
    let contentObject = new Object();
    let resultObject = new Object();
    
    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [id];
    if(await inputErrorHandler(inputArray)){
        let nameList = ["result", "error"];
        let valueList = [null, "input is null"];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_withdrawal_result", contentObject);
        res.json(resultObject);
        return res.end();
    }

    try{
        let result = await userDao.destory(id);
        // result 1이면 성공 0이면 실패
        let nameList = ["result", "error"];
        let valueList = [result, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_withdrawal_result", contentObject);
    }catch(err){
        console.log(`withdrawal err : ${err}`)
        let nameList = ["result", "error"];
        let valueList = [null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_withdrawal_result", contentObject);
    }
    res.json(resultObject);
})


module.exports = router;