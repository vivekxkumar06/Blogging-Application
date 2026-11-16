const mongoose = require("mongoose");

const connectDB = async (maxRetries = 5, retryDelay = 2500) => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Please check your backend .env file.");
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        family: 4,
      });

      console.log(
        `[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`
      );
      return conn;
    } catch (error) {
      console.warn(
        `[MongoDB Connection Attempt ${attempt}/${maxRetries} Failed]: ${error.message}`
      );
      if (attempt === maxRetries) {
        console.error("[MongoDB Connection Error]: Max retries reached.");
        throw error;
      }
      await new Promise((res) => setTimeout(res, retryDelay));
    }
  }
};

module.exports = connectDB;
