var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');
var axios = require('axios');
let kakakoAuth = require('../utils/kakaoauth');

router.post('/', async (req, res) => {
    let inputLoginType = req.body.loginType;
    let inputKey = req.body.key;
    let inputPassword = req.body.password;
    let resultObejct = {};
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
        if(!await kakakoAuth(inputKey)){
            // 카카오 토큰이 유효하지 않다.
            let nameList = ["token", "error"];
            let valueList = [null, "kakao_auth_error"];
            tokenObject = createJson.multi(nameList, valueList);
            resultObject = createJson.one("login_result", tokenObject);
            res.json(resultObject);
            return res.end()
        }
    }else if(inputLoginType === "google"){
        // TODO

    }else if(inputLoginType === "email"){
        // TODO 
        
    }
    
    // token 만드는 코드
    let token = jwt.sign({
        key: inputKey // 토근의 내용(payload)
    },
    secretObj.secret, // 비밀키
    {
        expiresIn: '5m' // 유효기간
    })

    let isRead = false
    let userId = 0
    // 이메일이 있는지 DB에서 확인하는 코드  
    await userDao.read(inputKey)
    .then((result) => {
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
    }).catch((err) => {
        let nameList = ["token", "error"];
        let valueList = [null, err];
        tokenObject = createJson.multi(nameList, valueList);
        resultObject = createJson.one("login_result", tokenObject);
    });

    if(isRead){
        // User 데이터가 존재했다면
        // User LastLoginAt Update
        await userDao.updateLastTime(result.id)
        .then((result) => {
            console.log(`updateLastTime result : ${result}`)
        }).catch((err) => {
            console.log(`updateLastTime err : ${err}`)
        });
    }else{
        // User 데이터가 존재하지 않는다면.
        // 데이터베이스에 생성 후 토큰 보내기
        await userDao.create(inputLoginType, inputKey, inputPassword)
        .then((result) => {
            if(result !== null){
                let nameList = ["token", "error"];
                let valueList = [token, null];
                tokenObject = createJson.multi(nameList, valueList);
                resultObject = createJson.one("login_result", tokenObject);
            }
        }).catch((err) => {
            let nameList = ["token", "error"];
            let valueList = [null, err];
            tokenObject = createJson.multi(nameList, valueList);
            resultObject = createJson.one("login_result", tokenObject);
        });
    }    
    res.json(resultObject);
});

module.exports = router;