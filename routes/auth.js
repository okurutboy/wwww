// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const TronWeb = require("tronweb");

// Initialize TronWeb
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  solidityNode: "https://api.trongrid.io",
  eventServer: "https://api.trongrid.io",
});

// Register a new user
// router.post("/register", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(409).json({ error: "User already exists" });
//     }

//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create a new user
//     const newUser = new User({
//       email,
//       password: hashedPassword,
//     });

//     // Save the user to the database
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
router.get("/address/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }, { address: 1 });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the TRON balance of the user's address
    const address = user.address;
    const balanceInSun = await tronWeb.trx.getBalance(address);
    const balanceInTRX = tronWeb.fromSun(balanceInSun); // Convert balance from SUN to TRX

    res.json({ address: user.address, balance: balanceInTRX });
  } catch (error) {
    res.status(500).json({ error: "Error fetching user address and balance" });
  }
});

router.post("/register", async (req, res) => {
  const { username, fullname, email, password } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newAccount = await tronWeb.createAccount();

    // Create a new user
    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPassword,
      address: newAccount.address.base58,
      key: newAccount.privateKey,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id }, "your_secret_key", {
      expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
    });

    // Send the token in the response
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
