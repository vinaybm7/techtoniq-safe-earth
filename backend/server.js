const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const subscribeRoute = require("./routes/subscribe");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/techtoniqDB-eartquake", {

  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use("/api/subscribe", subscribeRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
