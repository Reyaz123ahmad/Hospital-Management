// scripts/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database connection
const MONGODB_URI = process.env.MONGODB_URI 

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    phone: String,
    role: String,
    isActive: Boolean
});

const User = mongoose.model('User', UserSchema);

const createAdmin = async () => {
    try {
        // ENV se values lo
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
        const ADMIN_NAME = process.env.ADMIN_NAME
        const ADMIN_PHONE = process.env.ADMIN_PHONE

        console.log('📌 Connecting to database...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Database connected');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
        
        if (existingAdmin) {
            console.log(`⚠️ Admin already exists with email: ${ADMIN_EMAIL}`);
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        // Create admin
        const admin = await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            phone: ADMIN_PHONE,
            role: 'admin',
            isActive: true
        });

        console.log('\n✅ Admin created successfully!');
        console.log('═'.repeat(40));
        console.log(`📧 Email: ${ADMIN_EMAIL}`);
        console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
        console.log(`👤 Name: ${ADMIN_NAME}`);
        console.log(`📱 Phone: ${ADMIN_PHONE}`);
        console.log(`🆔 Admin ID: ${admin._id}`);
        console.log('═'.repeat(40));

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdmin();