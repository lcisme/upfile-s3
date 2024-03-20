const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const File = sequelize.define(
    "files",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      originalName: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      // nameFile: {
      //   type: DataTypes.TEXT("long"),
      //   allowNull: false,
      // },
      s3Key: {
        type: DataTypes.TEXT("long"),
        allowNull: false,
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    //   deletedAt: {
    //     type: DataTypes.DATE,
    //     allowNull: true,
    //   },
    },
    {
      timestamps: true,
    }
  );

  return File;
};
