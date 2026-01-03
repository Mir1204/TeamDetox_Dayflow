const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`
    ╔════════════════════════════════════════╗
    ║   ✅ MongoDB Connected Successfully    ║
    ║   Host: ${conn.connection.host.padEnd(27)}║
    ║   Database: ${conn.connection.name.padEnd(23)}║
    ╚════════════════════════════════════════╝
    `);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

module.exports = connectDB;