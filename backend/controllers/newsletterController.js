const Newsletter = require("../models/Newsletter");

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
// @access  Public
const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.json({
        success: true,
        message: "You are already subscribed to our newsletter!",
      });
    }

    await Newsletter.create({ email });

    res.status(201).json({
      success: true,
      message: "Thank you for subscribing! Check your inbox for updates.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  subscribeNewsletter,
};
