"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("order_lists", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: { model: "users", key: "id" },
      },
      goods_id: {
        type: Sequelize.INTEGER,
        references: { model: "goods", key: "id" },
      },
      goods_quantity: {
        type: Sequelize.INTEGER,
      },
      order_date: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      rec_name: {
        type: Sequelize.STRING,
      },
      rec_phone: {
        type: Sequelize.STRING,
      },
      rec_address: {
        type: Sequelize.STRING,
      },
      delivery_company_id: {
        type: Sequelize.STRING,
      },
      invoice_number: {
        type: Sequelize.STRING,
      },
      order_state: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("order_lists");
  },
};
