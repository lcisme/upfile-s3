require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const { BaseResponse } = require("./src/files/fille.common");
const fileRouter = require("./src/files/file.routes");
const bodyParser = require("body-parser");
const db = require("./src/files/file.index.model");

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((err, req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  return BaseResponse.error(res, err.statusCode || 500, err.message || "Internal Server Error", err);
});
app.use("/v1/s3/files", fileRouter);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
