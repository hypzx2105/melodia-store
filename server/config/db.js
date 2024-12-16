const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

// Connect to MongoDB
mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

// Handle connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Connection success
db.once('open', () => {
    console.log(`Connected to MongoDB: mongodb://localhost/${process.env.DB_NAME}`);
});
