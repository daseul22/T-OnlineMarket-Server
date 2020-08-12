"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {
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
    }
  }
  reviews.init(
    {
      user_id: DataTypes.INTEGER,
      goods_id: DataTypes.INTEGER,
      title: DataTypes.STRING,
      contents: DataTypes.STRING,
      star: DataTypes.INTEGER,
      review_img: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "reviews",
    }
  );
  return reviews;
};
