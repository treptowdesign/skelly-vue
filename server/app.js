const express = require('express');
const sequelize = require('./sequelize'); 

require('./models/associations'); // Model Relationships

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json()); 

// Sync Sequelize models with the database
sequelize.sync().then(() => {
    console.log('Database synced');
}).catch((err) => {
    console.error('Failed to sync database: ', err);
});

// Home Route
app.get('/', (req, res) => {
    res.send('Home');
});

// User Routes
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);

// Post Routes
const postRoutes = require('./routes/postRoutes');
app.use(postRoutes);


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
