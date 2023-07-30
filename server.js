// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 4000;
const MONGODB_URI =
  "mongodb+srv://geookur:Jasper0712@cluster0.hegcid6.mongodb.net/Names";

mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connect();

  console.log(`Server running on port ${PORT}`);
});
