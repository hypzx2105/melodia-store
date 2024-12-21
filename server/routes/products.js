const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add a test product
router.get('/add', async (req, res) => {
    const sampleProduct = new Product({
        name: 'Test Guitar',
        price: 199,
        description: 'A test product for verification'
    });

    try {
        await sampleProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
