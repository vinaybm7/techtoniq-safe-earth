const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
