const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const User = require("../models/UserSchema");
const { validateUserRegistration } = require("../middleware/validationMiddleware");

const router = express.Router();
const privateKey = fs.readFileSync(path.join(__dirname, "../config/jwt_private_key.pem"), "utf8");
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive:true});
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });


router.use("/uploads", express.static(uploadDir));


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
            profilePic: user.profilePic ? `${process.env.SERVER_HOST}/uploads/${user.profilePic}` : ""
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.post("/upload-profile-pic", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ errorMessage: "No file uploaded." });
    }

    try {
        const profilePicFilename = req.file.filename;
        const userId = req.body.userId;

        if (!userId || userId === "null") {
            return res.status(400).json({ errorMessage: "Invalid user ID." });
        }

        const profilePicUrl = `/uploads/${profilePicFilename}`;
        const user = await User.findByIdAndUpdate(userId, { profilePic: profilePicUrl }, { new: true });

        if (!user) {
            return res.status(404).json({ errorMessage: "User not found." });
        }

        res.json({ profilePic: profilePicUrl });
    } catch (error) {
        console.error("Profile picture upload error:", error);
        res.status(500).json({ errorMessage: "Server error." });
    }
});


router.get("/profile/:userId", async (req, res) => {
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


module.exports = router;
