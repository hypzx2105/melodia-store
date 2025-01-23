// Server-side global variables
require('dotenv').config({ path: './config/.env' });

// Database
require('./config/db');

// Express
const express = require('express');
const app = express();
const createError = require('http-errors'); // Required for error handling
const axios = require('axios'); // Required for syncing products on server start

app.use(require('body-parser').json()); // Parse JSON requests
app.use(require('cors')({ credentials: true, origin: process.env.LOCAL_HOST })); // CORS setup

// Routers
app.use('/products', require('./routes/products'));

// Port
const PORT = process.env.SERVER_PORT;

// Sync Products on Server Start
const syncProducts = async () => {
    try {
        const res = await axios.post(`http://localhost:${PORT}/products/add-all`);
        console.log(res.data.message);
    } catch (err) {
        console.error('Error syncing products on server start:', err.message);
    }
};

// Start Server
app.listen(PORT, async () => {
    console.log(`Connected to port ${PORT}`);
    await syncProducts(); // Automatically sync products
});

// Error 404
app.use((req, res, next) => {
    next(createError(404));
});

// Other errors
app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});















