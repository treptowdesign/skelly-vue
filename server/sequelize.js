const { Sequelize } = require('sequelize');

// Initialize Sequelize to use an SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './mydatabase.sqlite' // This is the path to the database file
});

module.exports = sequelize;