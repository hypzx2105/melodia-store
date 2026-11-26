// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { publicKey } = require("../config/jwtKey");

module.exports = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ errorMessage: "Access denied. No token provided." });
    }
    try {
        const verified = jwt.verify(token, publicKey, { algorithms: ["RS256"] });
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ errorMessage: "Invalid or expired token." });
    }
};
