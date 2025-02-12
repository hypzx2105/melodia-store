// server/routes/users.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const User = require("../models/UserSchema");
const { validateUserRegistration } = require("../middleware/validationMiddleware");


const router = express.Router();
const privateKey = fs.readFileSync(path.join(__dirname, "../config/jwt_private_key.pem"), "utf8");

router.post("/register", validateUserRegistration, async (req, res) => {
    const { name, email, password, role } = req.body; // Allow role assignment
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Default role as 'customer' if not provided
        const userRole = role === "admin" ? "admin" : "customer";

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role: userRole });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            privateKey,
            { algorithm: "RS256", expiresIn: "1h" }
        );

        // Return token and user info
        res.status(201).json({
            message: "User registered successfully.",
            token,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).select("+password"); // Select password explicitly
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
