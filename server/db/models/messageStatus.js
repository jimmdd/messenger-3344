const Sequelize = require("sequelize");
const db = require("../db");

const MessageStatus = db.define("message_status", {
    recipentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('READ', 'SENT'),
        allowNull: false,
        defaultValue: "SENT"
    }
});

module.exports = MessageStatus;
