/**
 * Seed script: Adds a few initial feedback entries to give the homepage
 * testimonials section a populated look. Only runs if the collection is empty.
 * Run from backend folder: node seedFeedback.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');

const initialFeedback = [
    {
        name: "Rajesh Sharma",
        rating: 5,
        message: "Dhanvij Builders delivered exceptional quality on our commercial complex. The structural planning was meticulous and the team was highly professional throughout the project."
    },
    {
        name: "Priya Mehta",
        rating: 5,
        message: "Outstanding work on our residential villa! The attention to detail in the structural design and the quality of materials used was truly impressive. Completed ahead of schedule!"
    },
    {
        name: "Anil Deshmukh",
        rating: 4,
        message: "Very professional team with deep technical expertise. The civil engineering consultations were thorough and helped us save significantly on our foundation costs."
    },
    {
        name: "Sunita Wankhede",
        rating: 5,
        message: "We hired Dhanvij Builders for our 3-floor office building project in Wardha. The rebar quality and finishing work was top-notch. Highly recommend their services!"
    },
];

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Feedback.countDocuments();
    if (count > 0) {
        console.log(`Feedback collection already has ${count} entries. Skipping.`);
    } else {
        await Feedback.insertMany(initialFeedback);
        console.log(`✅ Seeded ${initialFeedback.length} feedback entries.`);
    }

    await mongoose.disconnect();
    console.log('Done.');
}

seed().catch(err => { console.error(err); process.exit(1); });
