const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');
const { validateProduct } = require('../middleware/validationMiddleware');

const ACCESS_LEVEL_ADMIN = 2;

const uploadDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
});


router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }
});


router.get('/:id', async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ errorMessage: 'Product not found.' });
    }
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ errorMessage: 'Product not found.' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }
});


router.post('/', auth, checkRole(ACCESS_LEVEL_ADMIN), upload.single('image'), validateProduct, async (req, res) => {
    try {
        const { name, price, description, color, rating, features } = req.body;
        const product = await new Product({
            name,
            price,
            description,
            color,
            rating: rating || 0,
            features: features ? features.split(',').map(f => f.trim()).filter(f => f) : [],
            image: req.file ? `/uploads/${req.file.filename}` : ''
        }).save();

        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }
});


router.delete('/:id', auth, checkRole(ACCESS_LEVEL_ADMIN), async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ errorMessage: 'Product not found.' });
        }
        // only remove images that were uploaded from the dashboard
        if (product.image && product.image.startsWith('/uploads/')) {
            fs.unlink(path.join(uploadDir, path.basename(product.image)), () => {});
        }
        res.json({ message: 'Product deleted.' });
    } catch (err) {
        res.status(500).json({ errorMessage: err.message });
    }
});

module.exports = router;
