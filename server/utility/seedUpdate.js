// In a new file, e.g., seedUpdate.js

const sequelize = require('./sequelize');
const { User, Post } = require('./models/associations');

const updateSeed = async () => {
    await sequelize.sync();

    // Fetch all users and update each
    const users = await User.findAll();
    for (const user of users) {
        // Update postCount for each user
        const posts = await Post.findAll({ where: { userId: user.id } });
        user.postCount = posts.length;
        await user.save();

        // If no posts exist for a user, create a "Hello World" post
        if (posts.length === 0) {
            await Post.create({
                content: 'Hello World',
                userId: user.id
            });
            user.postCount = 1;
            await user.save();
        }
    }

    console.log('Database updated!');
};

updateSeed().catch((err) => {
    console.error('Failed to update database:', err);
});
