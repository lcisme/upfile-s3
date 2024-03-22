const fs = require("fs");
const AWS = require("aws-sdk");
const accessKeyId = "AKIAS5NJMZVTFWTBAAWF";
const secretAccessKey = "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";
const bucketName = "uploadfile-to-s3";
const https = require("https");
const EventEmitter = require("events");

class S3AperoUploader {
  constructor(accessKeyId, secretAccessKey, bucketName) {
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.bucketName = bucketName;
    this.s3 = new AWS.S3({
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    });
  }

  async uploadFile(input, s3Key) {
    const result = new EventEmitter();

    if (!input) {
      result.emit("error", "File Path or URL is null.");
      return result;
    }

    if (Buffer.isBuffer(input)) {
      try {
        await this.uploadToS3(input, s3Key);
        result.emit("done");
      } catch (error) {
        result.emit("error", error);
      }
      return result;
    }

    if (typeof input === "string") {
      if (input.startsWith("http")) {
        try {
          await this.uploadFileFromURL(input, s3Key);
          result.emit("done");
        } catch (error) {
          result.emit("error", error);
        }
        return result;
      }

      if (!fs.existsSync(input)) {
        result.emit("error", errorMessage);
        return result;
      }

      const fileContent = fs.readFileSync(input);
      try {
        await this.uploadToS3(fileContent, s3Key);
        result.emit("done");
      } catch (error) {
        result.emit("error", error);
      }
    }
    return result;
  }

  async uploadFileFromURL(url, s3Key) {
    return new Promise((resolve, reject) => {
      https.get(url, (res) => {
        let data = [];
        let contentType = res.headers["content-type"];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          data = Buffer.concat(data);
          this.uploadToS3(data, s3Key, contentType)
            .then(resolve)
            .catch(reject);
        });
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
        reject(err);
      });
    });
  }

  async uploadToS3(dataFile, s3Key) {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.bucketName,
        Key: s3Key,
        Body: dataFile,
      };
      this.s3.upload(params, (err, data) => {
        if (err) {
          console.error("Error uploading file:", err);
          reject(err);
          return;
        }
        console.log("Upload successful:", data.Location);
        resolve(data.Location);
      });
    });
  }
}

const args = process.argv.slice(2);
if (args.length !== 2) {
  process.exit(1);
}

const uploader = new S3AperoUploader(accessKeyId, secretAccessKey, bucketName);
let [input, s3Key] = args;

(async () => {
  try {
    const result = await uploader.uploadFile(input, s3Key);

    result.on("done", () => {
      console.log("Upfile successfully !!! ");
    });

    result.on("error", (error) => {
      console.log("Upfile failed !!!", error);
    });
  } catch (error) {
    console.error("Error:", error);
  }
})();