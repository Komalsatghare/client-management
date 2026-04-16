require('dotenv').config();
const mongoose = require('mongoose');
const Feedback = require('./models/Feedback');

async function clear() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const res = await Feedback.deleteMany({});
    console.log(`✅ Deleted ${res.deletedCount} feedback entries.`);

    await mongoose.disconnect();
    console.log('Done.');
}

clear().catch(err => { console.error(err); process.exit(1); });
