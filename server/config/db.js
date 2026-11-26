const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
const User = require("../models/UserSchema");
require("dotenv").config({ path: path.join(__dirname, ".env") });


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eCommerce";


async function connectDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`Connected to MongoDB: ${MONGO_URI}`);
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

connectDB();

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

db.once("open", async () => {
    console.log("MongoDB database connection established successfully!");


    const adminEmail = process.env.ADMIN_EMAIL || "admin@ecommerce.com";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "AdminPass123!", 10);
        await new User({
            name: "Admin",
            email: adminEmail,
            password: hashedPassword,
            accessLevel: 2
        }).save();

        console.log("Admin user created!");
    }
});

module.exports = db;

