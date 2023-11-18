const sequelize = require('../sequelize');
const { User, Post } = require('../models/associations');
const faker = require('faker');

const seedPosts = async (numPosts) => {
    await sequelize.sync();
    const users = await User.findAll();

    if (users.length === 0) {
        console.log('No users found to seed posts.');
        return;
    }

    for (let i = 0; i < numPosts; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // rando post length
        const postType = Math.floor(Math.random() * 3); // Generates a number 0, 1, or 2
        let postContent;

        switch (postType) {
            case 0: // Short post (1-2 sentences)
                postContent = faker.lorem.sentences(Math.floor(Math.random() * 2) + 1);
                break;
            case 1: // Medium post (3-5 sentences)
                postContent = faker.lorem.sentences(Math.floor(Math.random() * 3) + 3);
                break;
            case 2: // Long post (1 paragraph)
                postContent = faker.lorem.paragraph();
                break;
            default:
                postContent = faker.lorem.sentences(2); // Fallback to 2 sentences
        }

        // create post
        await Post.create({
            content: postContent,
            userId: randomUser.id
        });

        // update user postCount
        await randomUser.increment('postCount');
    }

    console.log(`${numPosts} posts seeded!`);
};

const numPosts = parseInt(process.argv[2], 10) || 10;
seedPosts(numPosts).catch((err) => {
    console.error('Failed to seed posts:', err);
});
