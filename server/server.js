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

// Database
require('./config/db');

// Routers

app.use('/products', require('./routes/products'));

// Port
const PORT = process.env.SERVER_PORT;
app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
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














