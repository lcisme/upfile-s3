const S3AperoUploader = require("./file.services");

const accessKeyId = "AKIAS5NJMZVTFWTBAAWF";
const secretAccessKey = "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";
const bucketName = "uploadfile-to-s3";

const uploader = new S3AperoUploader(accessKeyId, secretAccessKey, bucketName);

const uploadFile = async (req, res) => {
  try {
    const { input, s3Key } = req.body;
    const result = await uploader.uploadFile(input, s3Key);
    result.on("done", (location) => {
      res.status(200).json({ message: "Upload successful", location });
    });
    result.on("error", (error) => {
      res.status(500).json({ message: "Upload failed", error });
    });
  } catch (error) {
    return next(error);
  }
};

const searchFile = async (req, res, next) => {
  try {
    console.log(req.query);
    const input = req.query.s3Key;
    const name = input.split("/").pop();
    const result = await uploader.searchFile(input);
    res.status(200).json({ message: result, name: name });
  } catch (error) {
    return next(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const s3Key = req.params.s3Key;
    const { input } = req.body; 
    const result = await uploader.uploadFile(input, s3Key);
    result.on("done", (location) => {
      res.status(200).json({ message: "Update successful", location });
    });

    result.on("error", (error) => {
     
        res.status(404).json({ message: "Update failed", error });
    })
  } catch (error) {
    return next(error);
  }
};


const deleteFile = async (req, res, next) => {
  try {
    const input = req.params.s3Key;
    console.log(input);
    await uploader.deleteFile(input);
    res.send({ message: "File has been deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  uploadFile,
  searchFile,
  updateFile,
  deleteFile,
};
