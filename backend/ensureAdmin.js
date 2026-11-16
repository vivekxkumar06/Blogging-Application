const path = require("path");
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const User = require("./models/User");

async function connectWithRetry(maxRetries = 10, delay = 3000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      console.log(`Connecting to MongoDB Atlas (attempt ${i}/${maxRetries})...`);
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 15000,
        family: 4,
      });
      console.log("Connected successfully to MongoDB!");
      return;
    } catch (err) {
      console.log(`Attempt ${i} failed: ${err.message}. Retrying in ${delay / 1000}s...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error("Failed to connect after multiple retries");
}

async function run() {
  try {
    await connectWithRetry();

    const adminEmail = "admin@buildnotes.dev";
    const adminPass = "AdminPassword123!";

    let admin = await User.findOne({ email: adminEmail }).select("+password");
    if (admin) {
      console.log("Admin account already exists. Updating password and role...");
      admin.password = adminPass;
      admin.role = "admin";
      await admin.save();
    } else {
      console.log("Admin account does not exist. Creating admin account now...");
      admin = await User.create({
        name: "Saurabh Sharma",
        email: adminEmail,
        password: adminPass,
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        bio: "Lead Software Architect & Tech Writer. Administrator of BuildNotes.",
        website: "https://buildnotes.dev",
      });
    }

    // Verify password matching using matchPassword method
    const verifyAdmin = await User.findOne({ email: adminEmail }).select("+password");
    const isMatch = await verifyAdmin.matchPassword(adminPass);
    console.log(`Verification: Admin password match = ${isMatch ? "SUCCESS" : "FAILED"}`);

    // Update demo author
    const authorEmail = "sarah@buildnotes.dev";
    const authorPass = "Password123!";
    let author = await User.findOne({ email: authorEmail }).select("+password");
    if (author) {
      author.password = authorPass;
      await author.save();
      console.log("Updated demo author password to Password123!");
    } else {
      await User.create({
        name: "Sarah Jenkins",
        email: authorEmail,
        password: authorPass,
        role: "user",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        bio: "Senior Frontend Engineer & UI/UX Specialist.",
      });
      console.log("Created demo author account.");
    }

    const allUsers = await User.find({});
    console.log("\n==========================================");
    console.log(`TOTAL USERS IN DATABASE: ${allUsers.length}`);
    allUsers.forEach((u) => {
      console.log(`- ${u.name} | ${u.email} | Role: ${u.role}`);
    });
    console.log("\nADMIN LOGIN CREDENTIALS:");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPass}`);
    console.log(`Role:     admin`);
    console.log("==========================================");

    process.exit(0);
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

run();
