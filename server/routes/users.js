// server/routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/UserSchema");
const { validateUserRegistration } = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();
const privateKey = fs.readFileSync(path.join(__dirname, "../config/jwt_private_key.pem"), "utf8");

router.post("/register", validateUserRegistration, async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already registered." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role: "customer" });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found." });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: "Incorrect password." });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            privateKey,
            { algorithm: "RS256", expiresIn: "1h" }
        );
        res.json({ token, role: user.role, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;
