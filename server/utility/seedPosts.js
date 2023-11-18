const sequelize = require('./sequelize');
const { User, Post } = require('./models/associations');
const bcrypt = require('bcrypt');

const seedPosts = async () => {
    await sequelize.sync();
    // Retrieve all users
    const users = await User.findAll();
    for (const user of users) {
        // Create a post for each user
        await Post.create({
            content: 'Hello World',
            userId: user.id
        });
    }
    console.log('Posts seeded!');
};

seedPosts().catch((err) => {
    console.error('Failed to seed posts:', err);
});

module.exports = seedPosts;
