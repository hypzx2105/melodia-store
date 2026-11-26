const fs = require("fs");
const path = require("path");

// first run: make .env from the example so the app works without extra steps
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
    fs.copyFileSync(path.join(__dirname, ".env.example"), envPath);
    console.log("Created server/config/.env from .env.example");
}

require("dotenv").config({ path: envPath });
