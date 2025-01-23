const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // MongoDB Product model

// Product List
const products = [
    { name: 'Acoustic Guitar', price: 199, description: 'A beautiful acoustic guitar.' },
    { name: 'Electric INDIAN Guitar', price: 299, description: 'PANAMA INDIAN GUITAR.' },
    { name: 'Violin IRISH', price: 399, description: 'A professional violin.' },
];

// Add/Update All Products
router.post('/add-all', async (req, res) => {
    try {
        await Promise.all(
            products.map(async (product) => {
                await Product.findOneAndUpdate(
                    { name: product.name }, // Match by name
                    product, // New data
                    { upsert: true, new: true } // Create or update
                );
            })
        );
        res.status(200).json({ message: 'Products added/updated successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;




