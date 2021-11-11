const userDao = require('../dbdao/userdao');

// input값이 key값이고 userId 값을 추츨한다.
module.exports = async (key) => {
    let userId = "";
    try{
        let result = await userDao.read(key);
        console.log(`post result : ${JSON.stringify(result)}`);
        userId = result.id
    }catch(err){
        console.log(`post error : ${err}`);
    }
    return userId;
}