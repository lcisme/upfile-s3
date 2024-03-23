const S3AperoUploader = require("./file.services");

const accessKeyId = "AKIAS5NJMZVTFWTBAAWF";
const secretAccessKey = "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";
const bucketName = "uploadfile-to-s3";
const uploader = new S3AperoUploader(accessKeyId, secretAccessKey, bucketName);

uploader.on("done", (location) => {
  console.log("Upload done:", location);
});
uploader.on("error", (error) => {
  console.error("Upload error:", error);
});

const uploadFile = async (req, res) => {
  try {
    const { input, s3Key } = req.body;
    await uploader.uploadFile(input, s3Key);
  } catch (error) {}
};

const searchFile = async (req, res, next) => {
  try {
    const input = req.query.s3Key;
    await uploader.searchFile(input);
  } catch (error) {
    next(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const s3Key = req.params.s3Key;
    const { input } = req.body;
    await uploader.uploadFile(input, s3Key);
  } catch (error) {
    next(error);
  }
};

const deleteFile = async (req, res, next) => {
  try {
    const input = req.params.s3Key;
    await uploader.deleteFile(input);
  } catch (error) {
    next(error);
  }
};

const moveFile = async (req, res, next) => {
  try {
    const s3Key = req.params.s3Key;
    const { newKey } = req.body;
    await uploader.moveFile(s3Key, newKey);
  } catch (error) {
    next(error);
  }
};

const copyFile = async (req, res, next) => {
  try {
    const s3Key = req.params.s3Key;
    const { newKey } = req.body;
    await uploader.copyFile(s3Key, newKey);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  searchFile,
  updateFile,
  deleteFile,
  moveFile,
  copyFile,
};
