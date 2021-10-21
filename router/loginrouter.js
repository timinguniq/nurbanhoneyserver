var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let kakakoAuth = require('../utils/kakaoauth');
let createJwtToken = require('../utils/createjwttoken');
const kakaoauth = require('../utils/kakaoauth');

router.post('/', async (req, res) => {
    let inputLoginType = req.body.loginType;
    let inputKey = req.body.key;
    let inputPassword = req.body.password;
    let resultObject = {};
    let tokenObject = new Object();
    if(!inputKey.includes("@")){
        inputPassword = "1111";
    }

    // 로그인 타입 확인하는 코드
    if(inputLoginType !== "kakao" && inputLoginType !== "google" && inputLoginType !== "email"){
        let nameList = ["token", "error"];
        let valueList = [null, "loginType_error"];
        tokenObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("login_result", tokenObject);        
        res.json(resultObject);
        return res.end();
    }

    // 로그인 타입이 카카오일 때 처리
    if(inputLoginType === "kakao"){
        let kakaoProfileId = await kakaoauth(inputKey);
        if(!kakaoProfileId){
            // 카카오 토큰이 유효하지 않다.
            let nameList = ["token", "error"];
            let valueList = [null, "kakao_auth_error"];
            tokenObject = createJson.multi(nameList, valueList);
            resultObject = createJson.one("login_result", tokenObject);
            res.json(resultObject);
            return res.end()
        }

        inputKey = "K-" + kakaoProfileId;
    }else if(inputLoginType === "google"){
        // TODO


        inputKey = "G-" + inputKey;
    }else if(inputLoginType === "email"){
        // TODO 
        

        inputKey = "E-" + inputKey;
    }
    
    // token 만드는 코드
    let token = createJwtToken(inputKey);

    let isRead = false
    let userId = 0
    // 이메일이 있는지 DB에서 확인하는 코드  
    try{
        let result = await userDao.read(inputKey);
        console.log(`result : ${result}`);
        if(result !== null){
            isRead = true;
            userId = result.id;            
            
            if(result.password === inputPassword){
                let nameList = ["token", "error"];
                let valueList = [token, null];
                tokenObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("login_result", tokenObject);
            }else{
                let nameList = ["token", "error"];
                let valueList = [null, "login_fail"];
                tokenObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("login_result", tokenObject);
            }
        }
    }catch(err){
        let nameList = ["token", "error"];
        let valueList = [null, err];
        tokenObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("login_result", tokenObject);
    }

    if(isRead){
        // User 데이터가 존재했다면
        // User LastLoginAt Update
        try{
            let result = await userDao.updateLastTime(userId);
            console.log(`updateLastTime result : ${result}`)
        }catch(err){
            console.log(`updateLastTime err : ${err}`)
        }
    }else{
        // User 데이터가 존재하지 않는다면.
        // user DB의 카운터 수 가져오기
        let userCount = 0
        try{
            let result = await userDao.readCount();
            console.log(result.dataValues.n_ids)
            userCount = result.dataValues.n_ids;
        }catch(err){
            console.log(err);
        }

        // 데이터베이스에 생성 후 토큰 보내기
        try{
            let nickname = "너반꿀" + userCount;
            let result = await userDao.create(inputLoginType, inputKey, inputPassword, nickname);
            if(result !== null){
                let nameList = ["token", "userId", "error"];
                let valueList = [token, userId, null];
                tokenObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("login_result", tokenObject);
            }
        }catch(err){
            let nameList = ["token", "userId", "error"];
            let valueList = [null, null, err];
            tokenObject = createJson.multi(nameList, valueList);
            resultObject = createJson.one("login_result", tokenObject);
        }
    }
    res.json(resultObject);
});

module.exports = router;