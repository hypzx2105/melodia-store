// Server-side global variables
require('dotenv').config({ path: './config/.env' });

// Database
require('./config/db');

// Express
const express = require('express');
const app = express();
const createError = require('http-errors'); // Required for error handling

app.use(require('body-parser').json()); // Parse JSON requests
app.use(require('cors')({ credentials: true, origin: process.env.LOCAL_HOST })); // CORS setup

// Routers
app.use('/products', require('./routes/products')); // Corrected route

// Port
const PORT = process.env.SERVER_PORT;

// Start Server
app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
});

// Error 404
app.use((req, res, next) => {
    next(createError(404));
});

















