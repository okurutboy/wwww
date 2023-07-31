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

router.post("/withdrawaaa", async (req, res) => {
  // const { userEmail } = req.params;
  // try {
  //   const user = await User.findOne({ userEmail }, { address: 1 });
  //   if (!user) {
  //     return res.status(404).json({ error: "User not found" });
  //   }

  //   // Get the TRON balance of the user's address
  //   const address = user.address;
  //   // const balanceInSun = await tronWeb.trx.getBalance(address);
  //   // const balanceInTRX = tronWeb.fromSun(balanceInSun); // Convert balance from SUN to TRXuser.

  //   const pri = user.key;

  //   // res.json({ address: user.address, balance: balanceInTRX });

  //   const fullNodeURL = "https://api.trongrid.io";
  //   const solidityNodeURL = "https://api.trongrid.io";
  //   const eventServerURL = "https://api.trongrid.io";
  //   const privateKey = pri;

  //   const tronWeb = new TronWeb(
  //     fullNodeURL,
  //     solidityNodeURL,
  //     eventServerURL,
  //     privateKey
  //   );

  //   const senderAddress = user.address; // Replace with the actual sender's address
  //   const recipientAddress = req.body.recipientAddress; // Get the recipient address from the request body
  //   const amountToWithdraw = req.body.amount; // Get the amount to withdraw from the request body

  //   try {
  //     const transaction = await tronWeb.transactionBuilder.sendTrx(
  //       recipientAddress,
  //       tronWeb.toSun(amountToWithdraw), // Convert amount to Sun (the smallest unit of TRX)
  //       senderAddress
  //     );

  //     const signedTransaction = await tronWeb.trx.sign(transaction);
  //     const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

  //     res.json({ success: true, transactionResult: result });
  //   } catch (error) {
  //     console.error("Withdrawal failed:", error);
  //     res.status(500).json({ success: false, error: "Withdrawal failed." });
  //   }
  // } catch (error) {
  //   res.status(500).json({ error: "Error fetching user address and balance" });
  // }

  const { userEmail } = req.body;
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // const saltRounds = 10;

    // const hashedPassword = await bcrypt.hash(password, saltRounds);
    // const newAccount = await tronWeb.createAccount();

    // // Create a new user
    // const newUser = new User({
    //   username,
    //   fullname,
    //   email,
    //   password: hashedPassword,
    //   address: newAccount.address.base58,
    //   key: newAccount.privateKey,
    // });
    // await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

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
router.post("/Withdrawtoken", async (req, res) => {
  try {
    const { email, address, amount } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // return res.status(201).json({ message: user.key });

    const fullNodeURL = "https://api.trongrid.io";
    const solidityNodeURL = "https://api.trongrid.io";
    const eventServerURL = "https://api.trongrid.io";
    const privateKey = user.key;

    const tronWeb = new TronWeb(
      fullNodeURL,
      solidityNodeURL,
      eventServerURL,
      privateKey
    );

    const senderAddress = user.address; // Replace with the actual sender's address
    const recipientAddress = address; // Get the recipient address from the request body
    const amountToWithdraw = amount; // Get the amount to withdraw from the request body

    try {
      const transaction = await tronWeb.transactionBuilder.sendTrx(
        recipientAddress,
        tronWeb.toSun(amountToWithdraw), // Convert amount to Sun (the smallest unit of TRX)
        senderAddress
      );

      const signedTransaction = await tronWeb.trx.sign(transaction);
      const result = await tronWeb.trx.sendRawTransaction(signedTransaction);

      res.json({ success: true, transactionResult: result });
    } catch (error) {
      console.error("Withdrawal failed:", error);
      res.status(500).json({ success: false, error: "Withdrawal failed." });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
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
