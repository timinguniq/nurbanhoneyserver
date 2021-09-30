var express = require('express');
var router = express.Router();
const userDao = require('../dbdao/userdao');
var createJson = require('../utils/createjson');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

router.post('/', async (req, res) => {
    let inputEmail = req.query.email;
    // TODO : 나중에 코드 고쳐야됨.
    let inputPassword = req.query.password;
    if(!inputEmail.includes("@")){
        inputPassword = "1111";
    }
    
    // token 만드는 코드
    let token = jwt.sign({
        email: inputEmail // 토근의 내용(payload)
    },
    secretObj.secret, // 비밀키
    {
        expiresIn: '30d' // 유효기간
    })

    // 이메일이 있는지 DB에서 확인하는 코드
    await userDao.read(inputEmail)
    .then((result) => {
        if(result.password === inputPassword){
            let resultObject = createJson("login_result", token);
            res.json(JSON.stringify(resultObject))
            return
        }
    }).catch((err) => {
        let resultObject = createJson("login_result", err);
        res.json(JSON.stringify(resultObject))
        return
    });

    // 데이터베이스에 생성 후 토큰 보내기
    await userDao.create(inputEmail, inputPassword)
    .then((result) => {
        console.log(`token : ${token}`);
        let resultObject = createJson("login_result", token);
        res.json(JSON.stringify(resultObject))        
    }).catch((err) => {
        let resultObject = createJson("login_result", err);
        res.json(JSON.stringify(resultObject))
    });
});

// TODO : 업데이트나 삭제 만들어야 될듯.

module.exports = router;