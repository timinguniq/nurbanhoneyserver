var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let createJwtToken = require('../utils/createjwttoken');
const kakaoauth = require('../utils/kakaoauth');
const naverauth = require('../utils/naverauth');
let inputErrorHandler = require('../utils/inputerrorhandler');
const constObj = require('../config/const');
const { v4: uuidv4 } = require('uuid');


router.post('/', async (req, res) => {
    let inputLoginType = req.body.loginType;
    let inputKey = req.body.key;
    let inputPassword = req.body.password;
    let resultObject = {};

    // 필수 input 값이 null이거나 undefined면 에러
    let inputArray = [inputKey];
    if(await inputErrorHandler(inputArray)){
        resultObject = createJson.error("input is null");        
        res.status(400).json(resultObject);
        return res.end();
    }

    //if(!inputKey.includes("@")){
    //    inputPassword = "1111";
    //}
    /// TODO: 나중에 이메일 로그인 만들면 수정하기
    inputPassword = "1111";

    // 로그인 타입 확인하는 코드
    if(inputLoginType !== "kakao" && inputLoginType !== "google" && inputLoginType !== "naver" && inputLoginType !== "email"){
        resultObject = createJson.error("loginType_error");        
        res.status(400).json(resultObject);
        return res.end();
    }

    // 로그인 타입이 카카오일 때 처리
    if(inputLoginType === "kakao"){
        let kakaoProfileId = await kakaoauth(inputKey);
        if(!kakaoProfileId){
            // 카카오 토큰이 유효하지 않다.
            resultObject = createJson.error("kakao_auth_error");
            res.status(401).json(resultObject);
            return res.end()
        }

        inputKey = "K-" + kakaoProfileId;
    }else if(inputLoginType === "google"){
        // TODO


        inputKey = "G-" + inputKey;
    }else if(inputLoginType === "naver"){
        // TODO
        let naverProfileId = await naverauth(inputKey);
        if(!naverProfileId){
            // 카카오 토큰이 유효하지 않다.
            resultObject = createJson.error("naver_auth_error");
            res.status(401).json(resultObject);
            return res.end()
        }

        inputKey = "N-" + naverProfileId;
    }else if(inputLoginType === "email"){
        // TODO         

        inputKey = "E-" + inputKey;
    }

    // TODO: 애초에 이걸 왜 만들었는지 모르겟는데. 일단 주석 처리 해놓음.
    //inputKey = inputKey + "u" + uuidv4().toString();
    
    // token 만드는 코드
    let token = createJwtToken(inputKey);
    console.log(`token : ${token}`);
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
                let nameList = ["token", "userId"];
                let valueList = [token, userId];
                resultObject = createJson.multi(nameList, valueList);
                res.status(200).json(resultObject);
            }else{
                resultObject = createJson.error("login_fail");
                res.status(400).json(resultObject);
            }
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }

    if(isRead){
        // User 데이터가 존재했다면
        // User LastLoginAt Update
        try{
            let result = await userDao.updateLastTime(userId);
            console.log(`updateLastTime result : ${result}`);
        }catch(err){
            console.log(`updateLastTime err : ${err}`);
        }
    }else{
        // User 데이터가 존재하지 않는다면.
        // user DB의 카운터 수 가져오기
        let userCount = 0;
        try{
            let result = await userDao.readCount();
            console.log(result[0].dataValues.n_ids);
            userCount = result[0].dataValues.n_ids;
        }catch(err){
            console.log(err);
        }

        // 데이터베이스에 생성 후 토큰 보내기
        try{
            let nickname = constObj.defaultNickname + userCount;
            let result = await userDao.create(inputLoginType, inputKey, inputPassword, nickname);
            if(result !== null){
                let nameList = ["token", "userId"];
                let valueList = [token, userId];
                resultObject = createJson.multi(nameList, valueList);
                res.status(201).json(resultObject);
            }
        }catch(err){
            resultObject = createJson.error(err);
            res.status(500).json(resultObject);
        }
    }
});

router.post('/token', async (req, res) => {
    let inputKey = req.body.key;
    let resultObject = {};

    // token 만드는 코드
    let token = createJwtToken(inputKey);

    // 데이터베이스에 생성 후 토큰 보내기
    try{
        let result = await userDao.create("test", inputKey, "1111", Math.random().toString());
        if(result !== null){
            resultObject = createJson.one("token", token);
            res.status(201).json(resultObject);
        }
    }catch(err){
        resultObject = createJson.error(err);
        res.status(500).json(resultObject);
    }
});

module.exports = router;