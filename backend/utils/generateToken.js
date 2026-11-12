const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || "buildnotes_super_secure_jwt_secret_key_2026",
    {
      expiresIn: "30d",
    }
  );
};

module.exports = generateToken;
