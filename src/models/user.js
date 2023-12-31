"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Group, { foreignKey: "groupId" });
      User.belongsToMany(models.Project, { through: "Project_User" });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      type: DataTypes.STRING,
      password: DataTypes.STRING,
      userName: DataTypes.STRING,
      address: DataTypes.STRING,
      gender: DataTypes.STRING,
      phone: DataTypes.STRING,
      groupId: DataTypes.INTEGER,
      refreshToken: DataTypes.STRING,
      code: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
