// adds the starting products to the database: npm run seed
require("./config/env");
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
    {
        name: "Electric Guitar",
        price: 849,
        description: "Semi hollow electric guitar in cherry red with a warm, full tone for blues, jazz and rock.",
        image: "/images/electric-guitar.jpg",
        color: "Cherry Red",
        rating: 4.8,
        features: ["Semi hollow maple body", "Two humbucker pickups", "22 frets", "Hard case included"]
    },
    {
        name: "Acoustic Guitar",
        price: 249,
        description: "Classic acoustic guitar with a bright, clear sound. A great first guitar.",
        image: "/images/acoustic-guitar.jpg",
        color: "Natural",
        rating: 4.5,
        features: ["Spruce top", "Steel strings", "Guitar stand included"]
    },
    {
        name: "Ukulele",
        price: 59,
        description: "Soprano ukulele, easy to learn and fun to play. Available in blue, purple and red.",
        image: "/images/ukulele.jpg",
        color: "Blue, Purple, Red",
        rating: 4.2,
        features: ["Soprano size", "Nylon strings", "Gig bag included"]
    },
    {
        name: "Violin",
        price: 389,
        description: "Full size violin with a warm, rich tone, ready to play for students and orchestra players.",
        image: "/images/violin.jpg",
        color: "Brown",
        rating: 4.7,
        features: ["Spruce top and maple back", "Full size 4/4", "Bow and rosin included", "Hard case"]
    },
    {
        name: "Flute",
        price: 429,
        description: "Silver plated concert flute with a clear, bright sound for students and orchestras.",
        image: "/images/flute.jpg",
        color: "Silver",
        rating: 4.4,
        features: ["Silver plated body", "Closed hole keys", "Case and cleaning rod"]
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
        name: "Digital Piano",
        price: 499,
        description: "88 key digital piano with weighted keys, built in speakers and a music stand.",
        image: "/images/digital-piano.jpg",
        color: "Black",
        rating: 4.6,
        features: ["88 weighted keys", "Headphone output", "Sustain pedal included", "USB MIDI"]
    },
    {
        name: "Drum Kit",
        price: 699,
        description: "Five piece acoustic drum kit with cymbals and hardware, ready for the stage.",
        image: "/images/drum-kit.jpg",
        color: "White",
        rating: 4.3,
        features: ["Bass drum, snare and three toms", "Hi hat, crash and ride cymbals", "Throne and sticks included"]
    },
    {
        name: "Guitar Amplifier",
        price: 299,
        description: "30 watt combo amp with a vintage clean sound and plenty of volume for practice and gigs.",
        image: "/images/amplifier.jpg",
        color: "Black",
        rating: 3.9,
        features: ["30 watts", "10 inch speaker", "Volume, treble and bass controls"]
    },
    {
        name: "Studio Microphone",
        price: 149,
        description: "Condenser microphone for recording vocals and instruments at home.",
        image: "/images/microphone.jpg",
        color: "Black",
        rating: 4.6,
        features: ["Cardioid pattern", "XLR output", "Shock mount and pop filter"]
    },
    {
        name: "Studio Headphones",
        price: 99,
        description: "Closed back headphones for practice, mixing and recording.",
        image: "/images/headphones.jpg",
        color: "Black",
        rating: 3.6,
        features: ["Closed back", "3 m cable", "Foldable"]
    }
];

async function seed() {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eCommers";
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    } catch (err) {
        console.error(`Could not connect to MongoDB at ${uri}. Make sure MongoDB is installed and running.`);
        process.exit(1);
    }
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Added ${products.length} products`);
    await mongoose.disconnect();
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});
