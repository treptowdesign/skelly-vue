const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // Import the sequelize instance

const Post = sequelize.define('Post', {
    // Define attributes
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // ... other fields
}, {
    // Model options
});

module.exports = Post;
