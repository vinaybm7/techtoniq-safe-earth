const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Subscription = require("../models/Subsciption"); // ✅ Fix spelling here
const secretKey = "your_secret_key"; // ✅ Keep consistent

router.post("/", async (req, res) => {
  const { email } = req.body;
  console.log("📩 New subscription attempt:", email);

  try {
    let user = await Subscription.findOne({ email });

    if (!user) {
      const token = jwt.sign({ email }, secretKey, { expiresIn: "365d" });

      // Save new subscription
      user = new Subscription({ email });
      await user.save();

      // Send token in response
      return res.status(201).json({ success: true, token });
    }

    // If already subscribed, still return a token (optional)
    const token = jwt.sign({ email }, secretKey, { expiresIn: "365d" });
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("❌ Subscription Error:", error);
    res.status(500).json({ success: false, message: "Server error: user already exist" });
  }
});

module.exports = router;
