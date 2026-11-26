// adds the starting products to the database: npm run seed
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "config/.env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    {
        name: "Electric Guitar",
        price: 649,
        description: "Solid body electric guitar with a fast neck, great for rock, blues and jazz.",
        image: "/images/electric-guitar.jpg",
        color: "Red",
        rating: 4.7,
        features: ["Solid alder body", "22 frets", "Two humbucker pickups", "Comes with a gig bag"]
    },
    {
        name: "Violin",
        price: 389,
        description: "Full size violin with a warm, rich tone, ready to play for students and orchestra players.",
        image: "/images/violin.jpg",
        color: "Brown",
        rating: 4.8,
        features: ["Spruce top and maple back", "Full size 4/4", "Bow and rosin included", "Hard case"]
    },
    {
        name: "Flute",
        price: 219,
        description: "Wooden flute with a soft, clear sound for classical and folk music.",
        image: "/images/flute.jpg",
        color: "Natural",
        rating: 4.3,
        features: ["Hand finished wood", "Six finger holes", "Cleaning rod included"]
    },
    {
        name: "Digital Piano",
        price: 499,
        description: "88 key digital piano with weighted keys and built in speakers.",
        image: "/images/keyboard.jpg",
        color: "White",
        rating: 4.6,
        features: ["88 weighted keys", "Headphone output", "Sustain pedal included", "USB MIDI"]
    },
    {
        name: "Snare Drum",
        price: 179,
        description: "14 inch snare drum with a bright, punchy sound for any kit.",
        image: "/images/snare-drum.jpg",
        color: "Red",
        rating: 4.2,
        features: ["14 x 5.5 inch shell", "Steel snare wires", "Sticks included"]
    },
    {
        name: "Alto Saxophone",
        price: 1099,
        description: "Gold lacquered alto sax with a smooth, soulful tone. Popular in jazz, blues and pop.",
        image: "/images/saxophone.jpg",
        color: "Gold",
        rating: 4.9,
        features: ["Eb alto", "Gold lacquer finish", "Mouthpiece and reed included", "Hard case"]
    },
    {
        name: "Trumpet",
        price: 459,
        description: "Bb trumpet with smooth valves and a bright, powerful sound.",
        image: "/images/trumpet.jpg",
        color: "Gold",
        rating: 4.5,
        features: ["Bb key", "Monel valves", "7C mouthpiece included"]
    },
    {
        name: "Banjo",
        price: 329,
        description: "Five string banjo for bluegrass and folk music.",
        image: "/images/banjo.jpg",
        color: "Brown",
        rating: 3.9,
        features: ["Five strings", "Mahogany resonator", "Adjustable bridge"]
    },
    {
        name: "Accordion",
        price: 799,
        description: "Piano accordion with 26 keys and 48 bass buttons.",
        image: "/images/accordion.jpg",
        color: "Pink",
        rating: 4.0,
        features: ["26 treble keys", "48 bass buttons", "Shoulder straps included"]
    },
    {
        name: "Djembe",
        price: 139,
        description: "Hand carved djembe with a goatskin head and deep bass.",
        image: "/images/djembe.jpg",
        color: "Brown",
        rating: 4.4,
        features: ["Hand carved wood", "Goatskin head", "Rope tuning"]
    },
    {
        name: "Maracas",
        price: 25,
        description: "A pair of colourful maracas for percussion and kids.",
        image: "/images/maracas.jpg",
        color: "Multicolour",
        rating: 3.6,
        features: ["Pair of two", "Wooden handles"]
    },
    {
        name: "Studio Microphone",
        price: 149,
        description: "Condenser microphone for recording vocals and instruments at home.",
        image: "/images/studio-microphone.jpg",
        color: "Silver",
        rating: 4.6,
        features: ["Cardioid pattern", "XLR output", "Desk stand included"]
    },
    {
        name: "Studio Headphones",
        price: 99,
        description: "Closed back headphones for practice, mixing and recording.",
        image: "/images/headphones.jpg",
        color: "White",
        rating: 4.3,
        features: ["Closed back", "3 m cable", "Foldable"]
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eCommers");
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Added ${products.length} products`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
