const fs = require("fs");
const AWS = require("aws-sdk");
const https = require("https");
const EventEmitter = require("events");

class S3AperoUploader extends EventEmitter {
  constructor(accessKeyId, secretAccessKey, bucketName) {
    super();
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
      result.emit("error", "File path or URL is null.");
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
        result.emit("error", "File does not exist.");
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
    https
      .get(url, (res) => {
        let data = [];
        let contentType = res.headers["content-type"];
        res.on("data", (chunk) => {
          data.push(chunk);
        });
        res.on("end", () => {
          data = Buffer.concat(data);
          this.uploadToS3(data, s3Key, contentType);
          this.emit("done");
        });
      })
      .on("error", (err) => {
        console.error("Error downloading file:", err);
        this.emit("error", err);
      });
  }

  async uploadToS3(dataFile, s3Key) {
    const params = {
      Bucket: this.bucketName,
      Key: s3Key,
      Body: dataFile,
    };

    this.s3.upload(params, (err, data) => {
      if (err) {
        console.error("Error uploading file:", err);
        this.emit("error", err);
        return;
      }
      console.log("Upload successful:", data.Location);
      this.emit("done", data.Location);
      return;
    });
  }

  async searchFile(s3Key) {
    const params = {
      Bucket: this.bucketName,
      Key: s3Key,
    };
    try {
      const data = await this.s3.headObject(params).promise();
      const location = this.s3.getSignedUrl("headObject", {
        Bucket: this.bucketName,
        Key: s3Key,
      });
      const responseData = { ...data, Location: location };
      this.emit("done", responseData);
      return responseData;
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }

  async deleteFile(s3Key) {
    const params = {
      Bucket: this.bucketName,
      Key: s3Key,
    };
    try {
      const data = await this.s3.deleteObject(params).promise();
      this.emit("done");
      return data;
    } catch (error) {
      this.emit("error", error);
      throw error;
    }
  }

  async moveFile(s3Key, newKey) {
    try {
      const copyParams = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${s3Key}`,
        Key: newKey,
      };
      await this.s3.copyObject(copyParams).promise();
      await this.s3.deleteObject({ Bucket: this.bucketName, Key: s3Key }).promise();
      console.log('Done.');
      this.emit("done")
      return
    } catch (error) {
      console.error('Error:', error);
      this.emit("error")
      return
    }
  }

  async copyFile(s3Key, newKey) {
    try {
      const copyParams = {
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${s3Key}`,
        Key: newKey,
      };
      await this.s3.copyObject(copyParams).promise();
      console.log('Done.');
      this.emit("done")
      return
    } catch (error) {
      console.error('Error:', error);
      this.emit("error")
      return
    }
  }
  
}

module.exports = S3AperoUploader;
