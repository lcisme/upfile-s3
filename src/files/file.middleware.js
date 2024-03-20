const multer = require("multer");
const { S3 } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const {MAXSIZE} = require("./file.config")
const util = require("util");

const storage = multer.memoryStorage();

const uploadFile = multer({
  storage: storage,
  limits: { fileSize: MAXSIZE },
}).array("file");

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;