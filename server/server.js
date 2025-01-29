
require('dotenv').config({ path: './config/.env' });


require('./config/db');

// Express
const express = require('express');
const app = express();
const createError = require('http-errors');

app.use(require('body-parser').json());
app.use(require('cors')({ credentials: true, origin: process.env.LOCAL_HOST }));

// Routers
app.use('/products', require('./routes/products'));

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

















