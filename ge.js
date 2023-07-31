const TronWeb = require("tronweb");

// Initialize TronWeb
const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  solidityNode: "https://api.trongrid.io",
  eventServer: "https://api.trongrid.io",
});

// Function to generate a random TRON address
const generateRandomAddress = async () => {
  try {
    const newAccount = await tronWeb.createAccount();
    console.log("Generated Address:", newAccount.address.base58);
    console.log("Private Key:", newAccount.privateKey);
  } catch (error) {
    console.error("Error generating address:", error);
  }
};

generateRandomAddress();
