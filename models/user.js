const { Sequelize, INET, INTEGER, STRING } = require("sequelize");
const { sequelize } = require("../database/database");

const User = sequelize.define("user", {
    id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    name: {
        type: STRING,
        allowNull: false,
    },
    email: {
        type: STRING,
        allowNull: false,
    },
});

exports.User = User;
