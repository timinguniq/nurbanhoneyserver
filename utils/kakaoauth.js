var axios = require('axios');

// 카카오 토큰 인증 메소드
module.exports = async (kakaoToken) => {
    try{
        // 카카오 토큰이 유효하다.
        let kakao_profile = await axios.get("https://kapi.kakao.com/v2/user/me", {
            headers:{
                Authorization: 'Bearer ' + kakaoToken,
                'Content-Type': 'application/json'
            }
        });

        if(kakao_profile.data.id !== null){
            return true
        }else{
            return false
        }
    }catch(e){
        // 카카오 토큰이 유효하지 않다.
        return false
    }   
}
    