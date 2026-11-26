const path = require("path");
require("./config/env");
require("./config/db");

const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const fs = require("fs");

const app = express();


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json());
app.use(cors({ credentials: true, origin: process.env.LOCAL_HOST }));


app.use("/uploads", express.static(uploadDir));
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use("/products", require("./routes/products"));
app.use("/users", require("./routes/users"));
app.use("/orders", require("./routes/orders"));


app.use((req, res, next) => {
    next(createError(404));
});


app.use((err, req, res, next) => {
    console.error("Error:", err.message);
    res.status(err.status || 500).json({ errorMessage: err.message || "Server error." });
});


const PORT = process.env.SERVER_PORT || 4000;
app.listen(PORT, () => {
    console.log(`Connected to port ${PORT}`);
});
