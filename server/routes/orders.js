const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


// the total is worked out here from the prices in the database, not taken from the client
router.post("/", auth, async (req, res) => {
    const { items, payPalPaymentID } = req.body;

    if (!Array.isArray(items) || items.length === 0 || !payPalPaymentID) {
        return res.status(400).json({ errorMessage: "Order is missing items or the PayPal payment ID." });
    }

    try {
        const products = await Product.find({ _id: { $in: items.map(item => item._id) } });

        const orderItems = items
            .map(item => {
                const product = products.find(p => p._id.toString() === item._id);
                if (!product) return null;
                return {
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: Math.max(1, parseInt(item.quantity) || 1)
                };
            })
            .filter(item => item);

        if (orderItems.length === 0) {
            return res.status(400).json({ errorMessage: "None of the products in the order exist." });
        }

        const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = await new Order({
            user: req.user.id,
            items: orderItems,
            total: Math.round(total * 100) / 100,
            payPalPaymentID
        }).save();

        res.status(201).json(order);
    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.get("/mine", auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ errorMessage: "Server error." });
    }
});

module.exports = router;
