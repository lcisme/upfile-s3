const express = require("express");
const router = new express.Router();
const fileController = require("./file.controller");

router.post("/upload", fileController.uploadFile);
router.get("/upload", fileController.searchFile);
router.delete("/delete/:s3Key", fileController.deleteFile);
router.patch("/update/:s3Key", fileController.updateFile);

module.exports = router;
