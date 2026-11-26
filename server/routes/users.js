const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/UserSchema");
const { privateKey } = require("../config/jwtKey");
const auth = require("../middleware/authMiddleware");
const checkRole = require("../middleware/roleMiddleware");
const { validateUserRegistration } = require("../middleware/validationMiddleware");

const router = express.Router();
const ACCESS_LEVEL_ADMIN = 2;
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive:true});
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith("image/"))
});


router.post("/register", upload.single("profilePic"), validateUserRegistration, async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ errorMessage: "Email already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // new accounts are always customers, admins are only made on the server
        await new User({
            name,
            email,
            password: hashedPassword,
            accessLevel: 1,
            profilePic: req.file ? `/uploads/${req.file.filename}` : ""
        }).save();

        res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ errorMessage: "User not found." });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ errorMessage: "Incorrect password." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.accessLevel },
            privateKey,
            { algorithm: "RS256", expiresIn: "1h" }
        );

        res.json({
            token,
            userId: user._id,
            role: user.accessLevel,
            name: user.name,
            email: user.email,
            profilePic: user.profilePic || ""
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.post("/upload-profile-pic", auth, upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ errorMessage: "No file uploaded." });
    }

    try {
        const profilePicUrl = `/uploads/${req.file.filename}`;
        const user = await User.findByIdAndUpdate(req.user.id, { profilePic: profilePicUrl }, { new: true });

        if (!user) {
            return res.status(404).json({ errorMessage: "User not found." });
        }

        res.json({ profilePic: profilePicUrl });
    } catch (error) {
        console.error("Profile picture upload error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.get("/profile/:userId", auth, async (req, res) => {
    if (req.user.id !== req.params.userId && req.user.role !== ACCESS_LEVEL_ADMIN) {
        return res.status(403).json({ errorMessage: "Access denied." });
    }

    try {
        const user = await User.findById(req.params.userId, { password: 0 });

        if (!user) {
            return res.status(404).json({ errorMessage: "User not found." });
        }

        res.json({
            name: user.name,
            email: user.email,
            profilePic: user.profilePic ? `${user.profilePic}` : ""
        });

    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.get("/", auth, checkRole(ACCESS_LEVEL_ADMIN), async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.delete("/:id", auth, checkRole(ACCESS_LEVEL_ADMIN), async (req, res) => {
    if (req.params.id === req.user.id) {
        return res.status(400).json({ errorMessage: "You can't delete your own account." });
    }

    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ errorMessage: "User not found." });
        }
        res.json({ message: "User deleted." });
    } catch (error) {
        res.status(500).json({ errorMessage: "Server error." });
    }
});


module.exports = router;
