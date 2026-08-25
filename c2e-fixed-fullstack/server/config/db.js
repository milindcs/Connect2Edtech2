const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoUri } = require('./env');

let memServer = null;

const connectOpts = {
  maxPoolSize: 50,
  minPoolSize: 10,
  bufferTimeoutMS: 8000,
  retryWrites: true,
  w: 'majority',
};

const tryConnect = async (uri) => {
  const conn = await mongoose.connect(uri, {
    ...connectOpts,
    serverSelectionTimeoutMS: 5000,
  });
  return conn;
};

const connectDB = async () => {
  try {
    try {
      const conn = await tryConnect(mongoUri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log('Configured MongoDB unavailable, trying local fallback...');
    }

    try {
      await mongoose.disconnect();
    } catch (e) {}

    try {
      const conn = await tryConnect('mongodb://localhost:27017/connect2edtech');
      console.log(`MongoDB Connected (local): ${conn.connection.host}`);
      return;
    } catch (err) {
      console.log('Local MongoDB unavailable, starting in-memory server...');
    }

    try {
      await mongoose.disconnect();
    } catch (e) {}

    memServer = await MongoMemoryServer.create();
    const conn = await tryConnect(memServer.getUri());
    delete process.env.MONGO_URI;
    console.log(`MongoDB Connected (in-memory): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
