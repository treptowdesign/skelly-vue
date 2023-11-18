const sequelize = require('./sequelize');
const User = require('./models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10; 

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = [
        { name: 'Alice', email: 'alice@example.com', password: 'password123' },
        { name: 'Bob', email: 'bob@example.com', password: 'password123' },
        { name: 'Carol', email: 'carol@example.com', password: 'password123' },
        { name: 'Tim', email: 'tim@example.com', password: 'password123' },
        { name: 'Steve', email: 'steve@example.com', password: 'password123' },
        { name: 'Sami', email: 'sami@example.com', password: 'password123' }
    ];

    for (let userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        await User.create({
            name: userData.name,
            email: userData.email,
            password: hashedPassword
        });
    }

    console.log('Database seeded!');
};

seedDatabase().catch((err) => {
    console.error('Failed to seed database:', err);
});
