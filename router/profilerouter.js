var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
var extractKey = require('../utils/extractkey');
var extractUserId = require('../utils/extractUserId');

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
        let profile = result.profile;
        let nickname = result.nickname;
        let description = result.description;
        let point = result.point;
        let insignia = result.insignia;

        let nameList = ["id", "loginType", "profile", "nickname", "description", "point", "insignia", "error"];
        let valueList = [id, loginType, profile, nickname, description, point, insignia, null];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }catch(err){
        console.log("err", err);
        let nameList = ["id", "loginType", "profile", "nickname", "description", "point", "insignia", "error"];
        let valueList = [null, null, null, null, null, null, null, err];
        contentObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("profile_result", contentObject);
    }
    res.json(resultObject);
});

// 닉네임 변경 통신
router.fatch('/nickname', async (req, res) => {

});

module.exports = router;