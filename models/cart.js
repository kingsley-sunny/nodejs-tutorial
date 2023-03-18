const { INTEGER } = require("sequelize");
const { sequelize } = require("../database/database");

const Cart = sequelize.define("cart", {
    id: {
        type: INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
});

exports.Cart = Cart;
