const express = require('express');
const router = express.Router();
const { User, Post } = require('../models/associations');

const bcrypt = require('bcrypt');
const saltRounds = 10;

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(400).send(err.message);
    }
}); 

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            postCount: 1
        });

        // Create the initial "Hello World" post
        await Post.create({
            content: 'Hello World',
            userId: newUser.id
        });
        
        res.json(newUser);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Delete the user's posts
        await Post.destroy({ where: { userId: id } });
        
        const deleteUser = await User.destroy({
            where: { id: id }
        });
        if (deleteUser) {
            res.json({ message: 'User Deleted' });
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update a user
router.put('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email } = req.body;
        const [updated] = await User.update({ name, email }, {
            where: { id: id }
        });
        if (updated) {
            const updatedUser = await User.findOne({ where: { id: id } });
            res.json(updatedUser);
        } else {
            res.status(404).send('User Not Found');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// User login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.json({ 
                message: 'Login successful', 
                user: { 
                    name: user.name, 
                    email: user.email,
                    id: user.id
                } 
            });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;