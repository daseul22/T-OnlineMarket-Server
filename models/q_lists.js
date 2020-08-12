"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class q_lists extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.belongsTo(models.goods, {
        foreignKey: "goods_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.reply, {
        foreignKey: "q_lists_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
    }
  }
  q_lists.init(
    {
      user_id: DataTypes.INTEGER,
      goods_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      contents: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "q_lists",
    }
  );
  return q_lists;
};
