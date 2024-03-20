const express = require("express");
const router = new express.Router();
const { createFile } = require("./file.controller");

router.post("/upload", createFile);
// router.get("/get", searcFile);
module.exports = router;


const s3Cuong = require("")

s3Cuong.upFile(file)