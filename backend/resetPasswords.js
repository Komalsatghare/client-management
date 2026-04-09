/**
 * Password Reset Script
 * Run this once to reset admin and/or client passwords.
 * Usage: node resetPasswords.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');
const Client = require('./models/Client');

// ============================================================
// ✏️  SET YOUR DESIRED NEW PASSWORDS HERE
// ============================================================
const NEW_ADMIN_PASSWORD  = 'Admin@123';   // change to whatever you want
const NEW_CLIENT_EMAIL    = '';            // leave empty to skip client reset
const NEW_CLIENT_PASSWORD = 'Client@123'; // change to whatever you want
// ============================================================

async function main() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected:', mongoose.connection.name);

    // --- Reset Admin Password ---
    const admins = await Admin.find({});
    if (admins.length === 0) {
        console.log('⚠️  No admin accounts found in the database.');
    } else {
        console.log('\n📋 Admin accounts found:');
        admins.forEach((a, i) => console.log(`  ${i + 1}. username: "${a.username}"  id: ${a._id}`));

        // Reset password for ALL admins (or change to target one by username)
        for (const admin of admins) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(NEW_ADMIN_PASSWORD, salt);
            await admin.save();
            console.log(`  ✅ Password reset for admin "${admin.username}" → "${NEW_ADMIN_PASSWORD}"`);
        }
    }

    // --- Reset Client Password (optional) ---
    if (NEW_CLIENT_EMAIL) {
        const client = await Client.findOne({ email: NEW_CLIENT_EMAIL });
        if (!client) {
            console.log(`\n⚠️  No client found with email "${NEW_CLIENT_EMAIL}".`);
        } else {
            const salt = await bcrypt.genSalt(10);
            client.password = await bcrypt.hash(NEW_CLIENT_PASSWORD, salt);
            await client.save();
            console.log(`\n✅ Password reset for client "${client.name}" (${client.email}) → "${NEW_CLIENT_PASSWORD}"`);
        }
    } else {
        // List all clients so you can pick the right email
        const clients = await Client.find({}, 'name email');
        if (clients.length > 0) {
            console.log('\n📋 Client accounts found (fill NEW_CLIENT_EMAIL above to reset one):');
            clients.forEach((c, i) => console.log(`  ${i + 1}. name: "${c.name}"  email: "${c.email}"`));
        }
    }

    await mongoose.disconnect();
    console.log('\n✅ Done. You can now delete this script.');
    process.exit(0);
}

main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
});
