const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

/**
 * Creates a default admin account only when no admin exists in the database.
 * Credentials come from env (see .env.example); does not alter existing signup/login APIs.
 */
async function seedDefaultAdminIfNeeded() {
    try {
        const count = await Admin.countDocuments();
        if (count > 0) {
            return;
        }

        const username =
            process.env.DEFAULT_ADMIN_USERNAME || 'admin';
        const plainPassword =
            process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);

        await Admin.create({
            username,
            password: hashedPassword,
        });

        console.log(
            '[seed] Default admin created. Username:',
            username,
            '(password is set from DEFAULT_ADMIN_PASSWORD or built-in default; see .env.example)'
        );
    } catch (err) {
        console.error('[seed] Default admin seed failed:', err.message);
    }
}

module.exports = seedDefaultAdminIfNeeded;
