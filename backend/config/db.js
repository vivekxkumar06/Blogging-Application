const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Get MongoDB connection string from .env
    const mongoUri = process.env.MONGO_URI;

    // Check MongoDB URI
    if (!mongoUri) {
      throw new Error(
        "MONGO_URI is missing. Please check your backend .env file.",
      );
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      family: 4,
    });

    console.log(
      `[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`,
    );

    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);

    throw error;
  }
};

module.exports = connectDB;
