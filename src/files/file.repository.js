const db = require("../files/file.index.model");
const File = db.File;

const createFile = async (fileData) => {
  const newFile = await File.create(fileData);
  return newFile;
};

module.exports = { createFile };



