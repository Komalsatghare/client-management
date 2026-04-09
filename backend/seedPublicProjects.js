/**
 * Seed script: Populates the PublicProject collection with the 3 existing
 * hardcoded homepage projects, but only if the collection is empty.
 * Run from the backend folder: node seedPublicProjects.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const PublicProject = require('./models/PublicProject');

const defaultProjects = [
    {
        title: "Commercial Building - Wardha, Maharashtra",
        category: "Commercial",
        image: "/images/image1.jpeg",
        shortDescription: "A modern multi-storey commercial building designed for office and retail use, featuring contemporary elevation and optimized space planning.",
        location: "Wardha, Maharashtra",
        status: "Completed",
        mapLink: "https://maps.app.goo.gl/zQLzWG5mNoaA7ihk7?g_st=aw",
        order: 1
    },
    {
        title: "Modern Residential Project - Wardha, Maharashtra",
        category: "Residential",
        image: "/images/image3.jpeg",
        shortDescription: "A contemporary two-floor residential villa featuring a sleek elevation, spacious balcony design, and modern architectural aesthetics.",
        location: "Wardha, Maharashtra",
        status: "Completed",
        mapLink: "https://maps.app.goo.gl/5ydZ5oqZma8jxXjc8?g_st=aw",
        order: 2
    },
    {
        title: "Luxury Duplex Residence – Wardha, Maharashtra",
        category: "Residential",
        image: "/images/image5.jpeg",
        shortDescription: "A premium duplex home designed with elegant lighting, minimalist facade, and a modern open-layout concept.",
        location: "Wardha, Maharashtra",
        status: "Completed",
        mapLink: "https://maps.app.goo.gl/JTUyWiJuNERcwXXm6?g_st=aw",
        order: 3
    }
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await PublicProject.countDocuments();
    if (count > 0) {
        console.log(`PublicProject collection already has ${count} entries. Skipping seed.`);
    } else {
        await PublicProject.insertMany(defaultProjects);
        console.log(`Seeded ${defaultProjects.length} public projects successfully!`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
