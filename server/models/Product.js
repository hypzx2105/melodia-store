const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    color: String,
    rating: { type: Number, default: 0 }
});

module.exports = mongoose.model('Product', productSchema);

