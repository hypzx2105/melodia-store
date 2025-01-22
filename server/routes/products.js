const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add a test product
router.get('/add', async (req, res) => {
   conole.log('add')
    const sampleProduct = new Product({
        id: '1',
        name: 'Guitar',
        price: 199,
        description: 'Acustic guitar, color black.'

    });

    console.log(sampleProduct);


    try {
        await sampleProduct.save();
        res.status(200).json({ message: 'Product added successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
