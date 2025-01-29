const AWS = require("aws-sdk");
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});

function getS3Params(fileName, fileBuffer, mimeType) {
	return {
		Bucket: process.env.S3_BUCKET_NAME,
		Key: fileName,
		Body: fileBuffer,
		ContentType: mimeType,
		ACL: 'public-read',
	};
}

module.exports = {
	s3, getS3Params
}