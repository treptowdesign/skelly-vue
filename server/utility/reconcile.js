const sequelize = require('../sequelize');
const { User, Post } = require('../models/associations');

const reconcilePostCounts = async () => {
    await sequelize.sync();

    // Retrieve all users
    const users = await User.findAll();
    
    for (const user of users) {
        // Count posts for each user
        const postCount = await Post.count({
            where: { userId: user.id }
        });

        // Update user postCount if different
        if (user.postCount !== postCount) {
            await user.update({ postCount });
            console.log(`Updated post count for user ${user.name} (ID: ${user.id}) to ${postCount}`);
        }
    }

    console.log('Post counts reconciled!');
};

reconcilePostCounts().catch(err => {
    console.error('Failed to reconcile post counts:', err);
});
