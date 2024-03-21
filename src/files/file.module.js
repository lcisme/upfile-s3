// const fs = require("fs");
// const AWS = require("aws-sdk");
// const accessKeyId = "AKIAS5NJMZVTFWTBAAWF";
// const secretAccessKey = "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";
// const bucketName = "uploadfile-to-s3";
// const https = require("https");

class S3Uploader {
  constructor(accessKeyId, secretAccessKey, bucketName) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.bucketName = bucketName;
    this.s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }
  // check xem url hay file
  uploadFile(filePathOrURL, s3Key) {
    if (!filePathOrURL) {
      console.error("file in path or url null.");
      return;
    }
    // doc file url
    if (filePathOrURL.startsWith("http")) {
      this.uploadFileFromURL(filePathOrURL, s3Key);
      return;
    }
    //doc buffer
    if (
      typeof filePathOrURL === "string" &&
      filePathOrURL.startsWith("<Buffer") &&
      filePathOrURL.endsWith(">")
    ) {
      const hexString = filePathOrURL.slice(8, -1).split(" ").join("");
      const bufferData = Buffer.from(hexString, "hex");
      this.uploadToS3(bufferData, s3Key);
      return;
    }
    // doc file tu may tinh
    if (!fs.existsSync(filePathOrURL)) {
      console.error(`The file '${filePathOrURL}' does not exist.`);
      return;
    }
    // doc file tu may tinh
    const fileContent = fs.readFileSync(filePathOrURL);
    this.uploadToS3(fileContent, s3Key);
  }
  // doc file url
 
  uploadFileFromURL(url, s3Key) {
    https
      .get(url, (res) => {
        let data = [];
        let contentType = res.headers['content-type']; 

        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          data = Buffer.concat(data);
          this.uploadToS3(data, s3Key, contentType);
        });
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
      });
  }

  uploadToS3(dataFile, s3Key) {
    const params = {
      Bucket: this.bucketName,
      Key: s3Key,
      Body: dataFile,
    };

    this.s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        return;
      }
      console.log("Upload successful:", data.Location);
    });
  }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error("Usage: node uploader.js <filePathOrURL> <s3Key>");
  process.exit(1);
}

const uploader = new S3Uploader(accessKeyId, secretAccessKey, bucketName);
const [filePathOrURL, s3Key] = args;

uploader.uploadFile(filePathOrURL, s3Key);
