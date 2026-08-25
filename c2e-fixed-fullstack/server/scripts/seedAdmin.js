/**
 * Secure, manually-run admin seed script for Connect2EdTech.
 *
 * Reuses the EXISTING backend architecture — the Admin model (which hashes
 * passwords via a bcryptjs pre-save hook), the existing env/database config,
 * and the existing connection helper. It does NOT create a new model, a new
 * auth system, or a new role system.
 *
 * The project identifies admins by the `Admin` collection itself (there is no
 * `role` field on the model), so creating a standard Admin document is exactly
 * what grants admin access through `protect('Admin')` and the login route.
 *
 * Usage:
 *   npm run seed:admin -- "Admin Name" admin@example.com "StrongPassword"
 */

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function main() {
  const [, , name, email, password] = process.argv;

  // 1. Missing arguments
  if (!name || !email || !password) {
    console.error('Error: missing arguments.');
    console.error('Usage: npm run seed:admin -- "Admin Name" admin@example.com "StrongPassword"');
    process.exit(1);
  }

  // 2. Invalid email
  if (!EMAIL_RE.test(email)) {
    console.error(`Error: "${email}" is not a valid email address.`);
    process.exit(1);
  }

  // 3. Weak password (model enforces minlength 6; fail fast with a clear message)
  if (String(password).length < 6) {
    console.error('Error: password must be at least 6 characters long.');
    process.exit(1);
  }

  // 4. Missing MongoDB connection string
  if (!mongoUri) {
    console.error('Error: MONGO_URI is not set. Add it to the server .env file.');
    process.exit(1);
  }

  // 5. Connect using the existing database configuration
  try {
    await connectDB();
  } catch (err) {
    // connectDB already logs the underlying error and exits on failure,
    // but guard anyway in case that behaviour changes.
    console.error('MongoDB connection failure:', err.message);
    process.exit(1);
  }

  try {
    // 6. Prevent duplicate admin accounts
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log(`An admin with email ${email} already exists. No duplicate created.`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // 7. Create — password is hashed automatically by the Admin model's
    //    bcryptjs pre-save hook. Never log the password.
    const admin = await Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    });

    console.log('Admin created successfully:');
    console.log(`  Name : ${admin.name}`);
    console.log(`  Email: ${admin.email}`);
    console.log('  Role : admin (Admin collection)');
    console.log(`  ID   : ${admin._id}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err.message);
    try {
      await mongoose.disconnect();
    } catch (_) {
      /* ignore disconnect errors */
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  try {
    mongoose.disconnect();
  } catch (_) {
    /* ignore */
  }
  process.exit(1);
});
