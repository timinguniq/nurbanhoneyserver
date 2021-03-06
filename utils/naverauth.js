var axios = require('axios');

// 네이버 토큰 인증 메소드
module.exports = async (naverToken) => {
    try{
        // 네이버 토큰이 유효하다.
        let naver_profile = await axios.get("https://openapi.naver.com/v1/nid/me", {
            headers:{
                Authorization: 'Bearer ' + naverToken,
                'Content-Type': 'application/json'
            }
        });
        Log.d("naver_profile", naver_profile)
        if(naver_profile.data.response.id !== null){
            return naver_profile.data.response.id;
        }else{
            return false
        }
    }catch(e){
        // 네이버 토큰이 유효하지 않다.
        return false
    }   
}
    