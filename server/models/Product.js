const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    color: String,
    rating: { type: Number, default: 0 },
    features: [String]
});

module.exports = mongoose.model('Product', productSchema);
