const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../service/authentication");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImageURL: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjEOEOzppBYVwUUAFc-qb38tnY8gaS_ltDsQZxxpg_Xw&s=10",
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Password hashing middleware
userSchema.pre("save", function () {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");

  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  user.salt = salt;
  user.password = hashedPassword;
});

// Login authentication method
userSchema.static(
  "matchpasswordAndGenerateTokens",
  async function (email, password) {
    const user = await this.findOne({ email });

    if (!user) {
      throw new Error("User not found!");
    }

    const userProvidedHash = createHmac("sha256", user.salt)
      .update(password)
      .digest("hex");

    if (user.password !== userProvidedHash) {
      throw new Error("Incorrect password");
    }

    const token = createTokenForUser(user);

    return token;
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
