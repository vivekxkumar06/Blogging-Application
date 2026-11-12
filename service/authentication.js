const JWT = require("jsonwebtoken");

const secret = process.env.JWT_SECRET || "tan_tana_tan_tantan_tara";

// Generate JWT Token
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };

  return JWT.sign(payload, secret);
}

// Validate JWT Token
function validateToken(token) {
  return JWT.verify(token, secret);
}

module.exports = {
  createTokenForUser,
  validateToken,
};
