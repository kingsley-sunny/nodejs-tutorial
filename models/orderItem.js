const { INTEGER, STRING } = require("sequelize");
const { sequelize } = require("../database/database");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    allowNull: false,
    type: INTEGER,
  },
});

exports.OrderItem = OrderItem;
