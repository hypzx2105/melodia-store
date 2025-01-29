const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    rating: { type: Number, default: 0 } // New field
});

module.exports = mongoose.model('Product', productSchema);

