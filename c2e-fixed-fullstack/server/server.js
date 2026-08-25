require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const Course = require('./models/Course');
const Gallery = require('./models/Gallery');
const { coursesData } = require('./seed/coursesData');
const { galleryData } = require('./seed/galleryData');
const { clientUrl, port } = require('./config/env');

const authRoutes = require('./routes/authRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const contactRoutes = require('./routes/contactRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const mentorRoutes = require('./routes/mentorRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const settingRoutes = require('./routes/settingRoutes');
const userAdminRoutes = require('./routes/userAdminRoutes');

const app = express();

// Trust proxy (for reverse proxies / load balancers)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS — in development, allow any localhost origin (the Vite dev server
// may run on 5173, 5174, etc. depending on which ports are in use).
// In production, fall back to CLIENT_URL allowlist.
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
    : true; // allow all in dev

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

// GridFS setup for storing files in MongoDB
const gridfsBuckets = new Map();

function getGridfsBucket(name) {
  if (!gridfsBuckets.has(name)) {
    gridfsBuckets.set(name, new GridFSBucket(mongoose.connection.db, { bucketName: name }));
  }
  return gridfsBuckets.get(name);
}

// Serve uploaded files from GridFS
app.use('/uploads', async (req, res, next) => {
  const match = req.url.match(/^\/(courses|gallery|resumes)\/(.+)$/);
  if (!match) return next();
  
  const [, subfolder, filename] = match;
  const bucket = getGridfsBucket(subfolder);
  
  try {
    const files = await bucket.find({ filename }).toArray();
    if (files.length > 0) {
      res.set('Content-Type', files[0].contentType || 'application/octet-stream');
      bucket.openDownloadStreamByName(filename).pipe(res);
      return;
    }
  } catch (err) {
    console.error('GridFS lookup error:', err);
  }
  
  // Fallback to filesystem for any legacy files
  const filePath = path.join(__dirname, 'uploads', subfolder, decodeURIComponent(filename));
  if (require('fs').existsSync(filePath)) {
    res.set('Content-Type', 'application/octet-stream');
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Connect2EdTech API is running' });
});

// ─── Rate limiting ──────────────────────────────────────────────
// Strict limit on auth routes to mitigate brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/user/login', authLimiter);
app.use('/api/contact', apiLimiter);
app.use('/api/enrollment', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/auth/user', userAuthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/mentor-application', mentorRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/admin/users', userAdminRoutes);

app.use(notFound);
app.use(errorHandler);

// ─── Auto-seed courses on startup (in-memory DB only) ─────────
async function seedIfEmpty() {
  if (process.env.MONGO_URI || process.env.NODE_ENV === 'production') return;
  try {
    const count = await Course.countDocuments();
    console.log(`[seed] Checking courses collection - current count: ${count}`);
    
    if (count === 0) {
      console.log(`[seed] No courses found, seeding ${coursesData.length} courses...`);
      const result = await Course.insertMany(coursesData.map((c) => ({ ...c, status: 'Active' })));
      console.log(`[seed] Successfully inserted ${result.length} courses into the catalogue`);
      
      // Verify the seed
      const verifyCount = await Course.countDocuments();
      console.log(`[seed] Verification - courses in DB: ${verifyCount}`);
    } else {
      console.log(`[seed] ${count} courses already present — skipping seed`);
    }
  } catch (err) {
    console.error('[seed] Failed to seed courses:', err);
  }

  try {
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany(galleryData.map((g, i) => ({ ...g, order: i })));
      console.log(`[seed] Inserted ${galleryData.length} gallery images`);
    } else if (galleryCount !== galleryData.length) {
      // Clean up duplicates / stale data from previous sessions (in-memory DB)
      await Gallery.deleteMany({});
      await Gallery.insertMany(galleryData.map((g, i) => ({ ...g, order: i })));
      console.log(`[seed] Reset gallery: inserted ${galleryData.length} images (was ${galleryCount})`);
    } else {
      console.log(`[seed] ${galleryCount} gallery images already present — skipping seed`);
    }
  } catch (err) {
    console.error('[seed] Failed to seed gallery:', err.message);
  }
}

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

(async () => {
  await connectDB();
  await seedIfEmpty();

  const server = app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is in use. Kill the process using it or set a different PORT.`);
      process.exit(1);
    }
    console.error('Server error:', err);
    process.exit(1);
  });
})().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
