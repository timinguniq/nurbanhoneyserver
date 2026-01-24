const localupload = require('./utils/localupload');
const localdelete = require('./utils/localdelete');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function testLocalUploadAndDelete() {
    const bucketName = 'test-bucket';
    const folderName = uuidv4();
    const imageFileName = 'test-image.png';
    const bodyBuffer = Buffer.from('test image content');

    console.log(`Starting test for folder: ${folderName}`);

    // Test Upload
    await new Promise((resolve, reject) => {
        localupload(bucketName, folderName, imageFileName, bodyBuffer, (result) => {
            console.log('Upload result:', result);
            if (result.result && result.result.includes(folderName)) {
                console.log('Upload SUCCESS');

                // Verify file exists
                const filePath = path.join(__dirname, 'public/uploads', folderName, imageFileName);
                if (fs.existsSync(filePath)) {
                    console.log('File exists on disk: SUCCESS');
                    resolve();
                } else {
                    console.error('File NOT found on disk: FAIL');
                    reject(new Error('File not found'));
                }
            } else {
                console.error('Upload failed result structure: FAIL');
                reject(new Error('Upload failed'));
            }
        });
    });

    // Test Delete
    console.log('Testing delete...');
    try {
        await localdelete(bucketName, folderName);

        const dirPath = path.join(__dirname, 'public/uploads', folderName);
        if (!fs.existsSync(dirPath)) {
            console.log('Directory deleted: SUCCESS');
        } else {
            console.error('Directory still exists: FAIL');
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
}

testLocalUploadAndDelete();
