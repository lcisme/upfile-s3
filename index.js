require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const fileRouter = require("./src/files/file.routes");
const bodyParser = require("body-parser");

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
