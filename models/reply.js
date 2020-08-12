"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reply extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.belongsTo(models.q_lists, {
        foreignKey: "q_lists_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
    }
  }
  reply.init(
    {
      user_id: DataTypes.INTEGER,
      text: DataTypes.STRING,
      q_lists_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "reply",
    }
  );
  return reply;
};
