// In a new file, e.g., cleanupOrphanPosts.js

const sequelize = require('../sequelize');
const { Post } = require('../models/associations');

const cleanupOrphanPosts = async () => {
    await sequelize.sync();

    // Find all posts
    const posts = await Post.findAll();
    for (const post of posts) {
        // Check if the user associated with the post exists
        const user = await post.getUser(); // Assuming Post belongs to User
        if (!user) {
            // If the user doesn't exist, delete the post
            await post.destroy();
        }
    }

    console.log('Orphan posts cleaned up!');
};

cleanupOrphanPosts().catch((err) => {
    console.error('Failed to clean up orphan posts:', err);
});

module.exports = cleanupOrphanPosts;
