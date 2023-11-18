const express = require('express');
const { Post, User } = require('../models/associations');
const router = express.Router();

// Get all posts
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll({
            include: [{
                model: User,
                attributes: ['name'] // get username
            }]
        });
        const postsData = posts.map(post => {
            return {
                id: post.id,
                content: post.content,
                userName: post.User.name, // Accessing the user's name
                userId: post.userId
            };
        });

        res.json(postsData);
    } catch (err) {
        res.status(400).send(err.message);
    }
}); 

// Create a new post
router.post('/posts', async (req, res) => {
    try {
        const newPost = await Post.create({
            content: req.body.content,
            userId: req.body.userId 
        });

        // Increment user's postCount
        const user = await User.findByPk(req.body.userId);
        user.postCount++;
        await user.save();

        res.json(newPost);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Get posts by userId
router.get('/posts/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.findAll({
            where: { userId: userId },
            include: [{
                model: User,
                attributes: ['name'], // include user's name
            }]
        });

        // response + username
        const postsData = posts.map(post => {
            return {
                id: post.id,
                content: post.content,
                userId: post.userId,
                userName: post.User.name // accessing from joined User model
            };
        });

        res.json(postsData);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a Post
router.delete('/posts/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        // First, find the post to get the userId
        const post = await Post.findByPk(id);
        if (!post) {
            return res.status(404).send('Post Not Found');
        }

        // Store the userId before deleting the post
        const userId = post.userId;

        // Delete the post
        await post.destroy();

        // Find the user and decrement postCount
        const user = await User.findByPk(userId);
        if (user) {
            user.postCount--;
            await user.save();
        }

        res.json({ message: 'Post Deleted' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});


module.exports = router;
