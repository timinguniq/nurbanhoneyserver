const fs = require('fs');
const path = require('path');

// 로컬 스토리지 디렉토리/파일 삭제 메소드
module.exports = async function emptyLocalDirectory(bucket, dir) {
    // dir은 보통 uuid (folderName)
    const targetDir = path.join(__dirname, '../public/uploads', dir);

    if (fs.existsSync(targetDir)) {
        // recursive: true, force: true로 디렉토리 및 내부 파일 모두 삭제
        try {
            fs.rmSync(targetDir, { recursive: true, force: true });
            console.log(`Deleted local directory: ${targetDir}`);
            return true;
        } catch (err) {
            console.error(`Error deleting local directory ${targetDir}:`, err);
            throw err;
        }
    } else {
        console.log(`Directory not found, skipping delete: ${targetDir}`);
        return false;
    }
}
