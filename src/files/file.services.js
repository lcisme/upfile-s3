const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { v4: uuidv4 } = require("uuid");
const { BaseResponse, ApplicationError } = require("./fille.common");
const File = require("./file.repository")
const s3Client = new S3Client();

const createFile = async (files) => {
  try {
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${uuidv4()}-${file.originalname}`,
          Body: file.buffer,
        };
        const uploadedFile = await s3Client.send(new PutObjectCommand(params));
        
        const fileData = {
          originalName: file.originalname,
          s3Key: params.Key 
        };

        await File.createFile(fileData); 
        return {fileData,uploadedFile};
      })
    );

    return uploadedFiles;
  } catch (error) {
    throw error;
  }
};

module.exports = { createFile };
// const readFile = async (key) => {
//     const params = {
//         Bucket: process.env.AWS_BUCKET_NAME,
//         Key: key
//     };

//     try {
//         const data = await s3Client.send(new GetObjectCommand(params));
//         return data.Body.toString('utf-8');
//     } catch (error) {
//         throw new ApplicationError(500, error.message);
//     }
// };
