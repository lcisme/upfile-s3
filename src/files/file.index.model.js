const Sequelize = require("sequelize");
const { DATABASE_URL } = require("./file.config.js");

const sequelize = new Sequelize(DATABASE_URL);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.File = require("./file.model.js")(sequelize, Sequelize);
// db.TimeDelete = require("./x.model.js")(sequelize, Sequelize);
module.exports = db;
