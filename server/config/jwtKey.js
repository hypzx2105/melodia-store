const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// the key is not in git, so it gets made the first time the server runs
const keyPath = path.join(__dirname, "jwt_private_key.pem");

if (!fs.existsSync(keyPath)) {
    const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
    fs.writeFileSync(keyPath, privateKey.export({ type: "pkcs1", format: "pem" }));
    console.log("Created a new JWT key in server/config");
}

const privateKey = fs.readFileSync(keyPath, "utf8");
const publicKey = crypto.createPublicKey(privateKey).export({ type: "spki", format: "pem" });

module.exports = { privateKey, publicKey };
