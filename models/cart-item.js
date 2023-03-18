const { Sequelize, INTEGER, STRING } = require("sequelize");
const { sequelize } = require("../database/database");

const CartItem = sequelize.define("cartItem", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    quantity: {
        type: INTEGER,
        allowNull: false,
    },
});

exports.CartItem = CartItem;
