/**
 * One-off script to create an administrator account.
 * There is no public registration endpoint by design — admins are created
 * manually, either by running this script or by inserting a document
 * directly into MongoDB (the password must be bcrypt-hashed if inserted
 * directly; this script handles hashing for you via the Admin model).
 *
 * Usage:
 *   node seed/createAdmin.js "Admin Name" admin@example.com "StrongPassword123"
 *   (or) npm run seed:admin -- "Admin Name" admin@example.com "StrongPassword123"
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  const [, , name, email, password] = process.argv;

  if (!name || !email || !password) {
    console.log('Usage: node seed/createAdmin.js "Admin Name" admin@example.com "StrongPassword123"');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`An admin with email ${email} already exists.`);
    await mongoose.disconnect();
    process.exit(0);
  }

  const admin = await Admin.create({ name, email: email.toLowerCase(), password });
  console.log(`Admin created successfully: ${admin.email}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to create admin:', err);
  process.exit(1);
});
