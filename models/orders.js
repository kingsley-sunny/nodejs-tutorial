const { INTEGER } = require("sequelize");
const { sequelize } = require("../database/database");

const Orders = sequelize.define("orders", {
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
});

exports.Orders = Orders;
