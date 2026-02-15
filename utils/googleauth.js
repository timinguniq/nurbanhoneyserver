const axios = require('axios');
const constObj = require('../config/const');

// Google Cloud Console에서 발급받은 Web Client ID
const CLIENT_ID = constObj.googleClientId;

module.exports = async (googleIdToken) => {
    try {
        // 1. 구글의 검증 API 호출
        // 이 API는 토큰의 서명을 확인하고 만료 여부를 체크해줍니다.
        const response = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleIdToken}`);

        const payload = response.data;

        // 2. 중요: 'aud' (audience) 필드 검증
        // 토큰이 유효하더라도, 이 토큰이 '우리 서비스'를 위해 발급된 것인지 확인해야 합니다.
        // 다른 앱에서 발급된 유효한 토큰을 탈취해 사용하는 것을 방지합니다.
        if (payload.aud !== CLIENT_ID) {
            console.error('인증 실패: 클라이언트 ID가 일치하지 않습니다.');
            return false;
        }

        console.log(`payload :`, payload);

        const userId = payload['sub']; // 구글 사용자의 고유 ID
        const email = payload['email'];
        const name = payload['name'];

        console.log('인증 성공:', name, email, userId);

        if (userId) {
            return userId;
        }

        return true;

    } catch (error) {
        // 토큰이 만료되었거나 위조된 경우 400 에러가 발생합니다.
        console.error('토큰 검증 실패:', error.response ? error.response.data : error.message);
        return false;
    }
}