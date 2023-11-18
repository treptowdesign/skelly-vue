const User = require('./user');
const Post = require('./post');

// Define relationships
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

// Export both models
module.exports = { User, Post };