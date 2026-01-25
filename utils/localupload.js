const fs = require('fs');
const path = require('path');
const createJson = require('../utils/createjson');

// 로컬 스토리지에 파일 업로드 하는 메소드
// bucketName은 S3 호환성을 위해 남겨두지만 실제로는 무시하거나 최상위 폴더명으로 사용할 수 있음
module.exports = async (bucketName, folderName, imageFileName, bodyBuffer, callback) => {
    // public/uploads 폴더 기반
    const uploadDir = path.join(__dirname, '../public/uploads', folderName);

    // 디렉토리가 없으면 생성
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, imageFileName);

    // 파일 쓰기
    fs.writeFile(filePath, bodyBuffer, (err) => {
        if (err) {
            console.error('Local upload error:', err);
            let resultObject = createJson.error(err);
            return callback(resultObject);
        } else {
            // 웹 접근 가능한 상대 경로 반환 (예: /uploads/uuid/filename.png)
            // bucketName이 URL에 포함되어야 한다면 조정 필요. 현재는 folderName/imageFileName 구조
            const publicUrl = `/images/${folderName}/${imageFileName}`;
            let resultObject = createJson.result(publicUrl);
            return callback(resultObject);
        }
    });
}
