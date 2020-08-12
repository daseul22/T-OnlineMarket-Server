"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    static associate(models) {
      this.hasMany(models.goods, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.q_lists, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.reply, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.reviews, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
      this.hasMany(models.order_lists, {
        foreignKey: "user_id",
        onUpdate: "cascade",
        onDelete: "set null",
      });
    }
  }
  users.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.STRING,
      trade_name: DataTypes.STRING,
      business_number: DataTypes.STRING,
      user_type: DataTypes.INTEGER,
      user_admission: DataTypes.INTEGER,
    },
    {
      hooks: {
        beforeCreate: (data, options) => {
          data.password = crypto
            .createHmac("sha256", "tomtom")
            .update(data.password)
            .digest("hex");
        },
        beforeBulkCreate: (data, options) => {
          data.forEach((val) => {
            val.password = crypto
              .createHmac("sha256", "tomtom")
              .update(val.password)
              .digest("hex");
          });
        },
        beforeFind: (data, options) => {
          if (data.where.password) {
            data.where.password = crypto
              .createHmac("sha256", "tomtom")
              .update(data.where.password)
              .digest("hex");
          }
        },
      },
      sequelize,
    },
    {
      modelName: "users",
    }
  );
  return users;
};
