const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema");
require("./env");


const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eCommerce";


// tries a few times before giving up, the first start on a slow laptop can take a while
async function connectDB(attempt = 1) {
    try {
        await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
        console.log(`Connected to MongoDB: ${MONGO_URI}`);
    } catch (error) {
        if (attempt < 3) {
            console.log(`MongoDB not ready yet, trying again (${attempt}/3)...`);
            return setTimeout(() => connectDB(attempt + 1), 2000);
        }
        console.error(`Could not connect to MongoDB at ${MONGO_URI}. Make sure MongoDB is installed and running.`);
        console.error(`Reason: ${error.message}`);
        process.exit(1);
    }
}

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error.message);
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

module.exports = connectDB;

