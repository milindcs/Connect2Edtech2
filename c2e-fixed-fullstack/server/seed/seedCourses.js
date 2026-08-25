/**
 * One-off script to populate/refresh the full training-program catalogue.
 * Safe to re-run: courses are upserted by (title + department), so running
 * it multiple times never creates duplicate entries. Existing courses that
 * are no longer in the list are left untouched (not deleted), so any
 * admin-created courses/edits are preserved.
 *
 * Usage:
 *   node seed/seedCourses.js
 *   (or) npm run seed:courses
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Course = require('../models/Course');
const { coursesData } = require('./coursesData');

const run = async () => {
  await connectDB();

  let created = 0;
  let updated = 0;

  for (const course of coursesData) {
    const existing = await Course.findOne({ title: course.title, department: course.department });

    if (existing) {
      existing.category = course.category;
      existing.description = course.description;
      existing.image = course.image || '';
      await existing.save();
      updated += 1;
    } else {
      await Course.create({ ...course, status: 'Active', image: '' });
      created += 1;
    }
  }

  console.log(`Course seed complete. Created: ${created}, Updated: ${updated}, Total processed: ${coursesData.length}`);

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Failed to seed courses:', err);
  process.exit(1);
});
