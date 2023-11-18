const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import the sequelize instance

const User = sequelize.define('User', {
    // Define attributes
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    // Model options
});

module.exports = User;
