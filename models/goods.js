"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class goods extends Model {
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.q_lists, {
        foreignKey: "goods_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.reviews, {
        foreignKey: "goods_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.order_lists, {
        foreignKey: "goods_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
    }
  }
  goods.init(
    {
      user_id: DataTypes.INTEGER,
      goods_name: DataTypes.STRING,
      goods_type: DataTypes.STRING,
      goods_img: DataTypes.STRING,
      goods_price: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      info_img: DataTypes.STRING,
      recommend_img: DataTypes.STRING,
      flower_language: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "goods",
    }
  );
  return goods;
};
