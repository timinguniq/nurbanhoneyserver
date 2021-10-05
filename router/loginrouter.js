var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

router.post('/', async (req, res) => {
    let inputEmail = req.body.email;
    let inputPassword = req.body.password;
    if(!inputEmail.includes("@")){
        inputPassword = "1111";
    }
    
    // token 만드는 코드
    let token = jwt.sign({
        email: inputEmail // 토근의 내용(payload)
    },
    secretObj.secret, // 비밀키
    {
        expiresIn: '5m' // 유효기간
    })

    let resultObejct = {};
    let isRead = false
    let userId = 0
    let tokenObject = new Object();
    // 이메일이 있는지 DB에서 확인하는 코드  
    await userDao.read(inputEmail)
    .then((result) => {
        if(result !== null){
            isRead = true;
            userId = result.id;            
            
            if(result.password === inputPassword){                
                tokenObject.token = token;
                tokenObject.error = null;
                resultObject = createJson("login_result", tokenObject);
            }else{
                tokenObject.token = null;
                tokenObject.error = "login_fail";
                resultObject = createJson("login_result", tokenObject);
            }
        }        
    }).catch((err) => {
        tokenObject.token = null;
        tokenObject.error = err;
        resultObject = createJson("login_result", tokenObject);
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
        await userDao.create(inputEmail, inputPassword)
        .then((result) => {
            if(result !== null){
                tokenObject.token = token;
                tokenObject.error = null;
                resultObject = createJson("login_result", tokenObject);
            }
        }).catch((err) => {
            tokenObject.token = null;
            tokenObject.error = err;
            resultObject = createJson("login_result", tokenObject);
        });
    }    
    res.json(JSON.stringify(resultObject))
});

module.exports = router;