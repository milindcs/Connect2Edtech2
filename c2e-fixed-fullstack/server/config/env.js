const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  // Local MongoDB is the default. To use MongoDB Atlas instead, set MONGO_URI
  // to your Atlas connection string (mongodb+srv://...). See .env.example.
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/connect2edtech',
  jwtSecret: process.env.JWT_SECRET,
  clientUrl: process.env.CLIENT_URL,
  port: process.env.PORT || 5000,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',

  // Email (SMTP) — used to notify the site owner when a contact or
  // enrollment form is submitted on the website.
  smtpHost: process.env.SMTP_HOST || '',
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true', // true for port 465
  smtpUser: process.env.SMTP_USER || '',
  smtpPass: process.env.SMTP_PASS || '',
  emailFrom: process.env.EMAIL_FROM || process.env.SMTP_USER || '',
  // Where new contact/enrollment submissions should be received.
  notifyEmail: process.env.NOTIFY_EMAIL || process.env.SMTP_USER || '',

  // Gmail SMTP — for Become a Trainer notifications and acknowledgements.
  // Uses Gmail App Password (never the regular account password).
  // Port 465 / secure:true is the recommended Gmail SMTP configuration.
  gmailUser: process.env.GMAIL_USER || '',
  gmailAppPass: process.env.GMAIL_APP_PASSWORD || '',
  trainerNotifyEmail: process.env.TRAINER_NOTIFICATION_EMAIL || process.env.GMAIL_USER || '',
};
