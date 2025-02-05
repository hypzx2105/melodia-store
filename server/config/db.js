const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });


mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));


db.once('open', () => {
    console.log(`Connected to MongoDB: mongodb://localhost/${process.env.DB_NAME}`);
});
