const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const { Readable } = require('stream');
const path = require('path');

const buckets = new Map();

function getBucket(name) {
  if (!buckets.has(name)) {
    buckets.set(name, new GridFSBucket(mongoose.connection.db, { bucketName: name }));
  }
  return buckets.get(name);
}

function buildFilename(originalname) {
  const ext = path.extname(originalname);
  const base = path
    .basename(originalname, ext)
    .replace(/[^a-zA-Z0-9-_]/g, '_')
    .slice(0, 40);
  return `${base}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
}

async function uploadToGridfs(buffer, filename, bucketName, contentType) {
  const bucket = getBucket(bucketName);
  const readable = Readable.from(buffer);
  return new Promise((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    readable.pipe(uploadStream);
    uploadStream.on('error', reject);
    uploadStream.on('finish', resolve);
  });
}

async function streamFromGridfs(filename, bucketName, res) {
  const bucket = getBucket(bucketName);
  const files = await bucket.find({ filename }).toArray();
  if (!files.length) {
    return false;
  }
  res.set('Content-Type', files[0].contentType || 'application/octet-stream');
  bucket.openDownloadStreamByName(filename).pipe(res);
  return true;
}

async function deleteFromGridfs(filename, bucketName) {
  const bucket = getBucket(bucketName);
  const files = await bucket.find({ filename }).toArray();
  for (const file of files) {
    await bucket.delete(file._id);
  }
}

module.exports = {
  getBucket,
  buildFilename,
  uploadToGridfs,
  streamFromGridfs,
  deleteFromGridfs,
};
