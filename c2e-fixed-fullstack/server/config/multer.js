const multer = require('multer');
const path = require('path');

const makeFilter = (allowedMimePrefixes) => (req, file, cb) => {
  if (allowedMimePrefixes.some((prefix) => file.mimetype.startsWith(prefix))) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: (Number(process.env.MAX_RESUME_SIZE_MB) || 5) * 1024 * 1024 },
  fileFilter: makeFilter([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ]),
});

const courseImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: makeFilter(['image/']),
});

const galleryImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: makeFilter(['image/']),
});

module.exports = { resumeUpload, courseImageUpload, galleryImageUpload };
