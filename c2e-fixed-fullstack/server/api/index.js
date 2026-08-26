const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const connectDB = require('../config/db');
const { notFound, errorHandler } = require('../middleware/errorMiddleware');
const { authLimiter, trainerLimiter, apiLimiter } = require('../middleware/rateLimitMiddleware');
const { validateGmailConfig } = require('../services/emailService');
const Course = require('../models/Course');
const Gallery = require('../models/Gallery');
const { coursesData } = require('../seed/coursesData');
const { galleryData } = require('../seed/galleryData');
const { clientUrl } = require('../config/env');

const authRoutes = require('../routes/authRoutes');
const userAuthRoutes = require('../routes/userAuthRoutes');
const contactRoutes = require('../routes/contactRoutes');
const courseRoutes = require('../routes/courseRoutes');
const enrollmentRoutes = require('../routes/enrollmentRoutes');
const mentorRoutes = require('../routes/mentorRoutes');
const trainerApplicationRoutes = require('../routes/trainerApplicationRoutes');
const dashboardRoutes = require('../routes/dashboardRoutes');
const galleryRoutes = require('../routes/galleryRoutes');
const trainerRoutes = require('../routes/trainerRoutes');
const settingRoutes = require('../routes/settingRoutes');
const userAdminRoutes = require('../routes/userAdminRoutes');

const app = express();
const isVercel = process.env.VERCEL === '1' || !!process.env.VERCEL;

app.set('trust proxy', 1);
app.use(helmet());

const allowedOrigins = (clientUrl || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

const corsOrigin =
  process.env.NODE_ENV === 'production'
    ? (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    : true;

app.use(
  cors({
    origin: corsOrigin,
    credentials: process.env.NODE_ENV === 'production',
  })
);

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Connect2EdTech API is running' });
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/user/login', authLimiter);
app.use('/api/contact', apiLimiter);
app.use('/api/enrollment', apiLimiter);
app.use('/api/trainer-application', trainerLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/mentor-application', mentorRoutes);
app.use('/api/trainer-application', trainerApplicationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin/users', userAdminRoutes);

app.use(notFound);
app.use(errorHandler);

let initialized = false;

async function initialize() {
  if (initialized) return;
  initialized = true;
  await connectDB();

  if (process.env.MONGO_URI || process.env.NODE_ENV === 'production') return;

  try {
    const count = await Course.countDocuments();
    if (count === 0) {
      await Course.insertMany(coursesData.map((c) => ({ ...c, status: 'Active' })));
      console.log('[seed] Seeded courses');
    }
  } catch (err) {
    console.error('[seed] Failed to seed courses:', err);
  }

  try {
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany(galleryData.map((g, i) => ({ ...g, order: i })));
      console.log('[seed] Seeded gallery');
    }
  } catch (err) {
    console.error('[seed] Failed to seed gallery:', err);
  }
}

if (isVercel) {
  initialize().catch(console.error);
  validateGmailConfig();
  module.exports = async (req, res) => {
    await initialize();
    app(req, res);
  };
} else {
  initialize().then(() => {
    const { port } = require('../config/env');
    app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
    });
  }).catch((err) => {
    console.error('Server startup error:', err);
    process.exit(1);
  });
}
