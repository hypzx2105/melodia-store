// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const privateKey = fs.readFileSync(path.join(__dirname, "../config/jwt_private_key.pem"), "utf8");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }
    try {
        const verified = jwt.verify(token, privateKey, { algorithms: ["RS256"] });
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or expired token." });
    }
};
