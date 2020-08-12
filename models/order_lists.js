"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_lists extends Model {
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
  order_lists.init(
    {
      user_id: DataTypes.INTEGER,
      goods_id: DataTypes.INTEGER,
      goods_quantity: DataTypes.INTEGER,
      order_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      rec_name: DataTypes.STRING,
      rec_phone: DataTypes.STRING,
      rec_address: DataTypes.STRING,
      delivery_company_id: DataTypes.STRING,
      invoice_number: DataTypes.STRING,
      order_state: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order_lists",
    }
  );
  return order_lists;
};
