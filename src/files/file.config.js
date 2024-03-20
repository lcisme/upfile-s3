const DATABASE_URL = process.env.DATABASE_URL || "mysql://root:root@localhost:3306/file-s3";
const MAXSIZE = (MAX_FILE_SIZE = 5 * 1024 * 1024);
module.exports = { MAXSIZE, DATABASE_URL };
