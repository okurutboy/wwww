const express = require('express');
const TronWeb = require('tronweb');

const app = express();
const port = 3000;

// Initialize TronWeb with your provider endpoint (TronGrid or any other)
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io',
  eventServer: 'https://api.trongrid.io',
  privateKey: 'f4564e2714c2885a7663f722c7e6ef0419fc0b37920b2cf746ff37165bc2b0f4', // Only for read-only tasks, don't expose private key in production!
});

// Middleware to handle JSON requests
app.use(express.json());

// Function to get token balance for a specific address and contract
async function getTokenBalance(address, contractAddress) {
  const contract = await tronWeb.contract().at(contractAddress);
  const balanceInSun = await contract.balanceOf(address).call();
  return tronWeb.fromSun(balanceInSun);
}

// Route to get wallet balance, including all tokens (USDT and BNB)
app.get('/api/balance/:address', async (req, res) => {
  try {
    if (!tronWeb.isConnected()) {
      res.status(500).json({ error: 'Not connected to the Tron network' });
      return;
    }

    const { address } = req.params;

    // Get TRX balance
    const trxBalanceInSun = await tronWeb.trx.getBalance(address);
    const trxBalanceInTrx = tronWeb.fromSun(trxBalanceInSun);

    // Get USDT balance
    const usdtContractAddress = '0x1234567890123456789012345678901234567890'; // Replace this with the actual USDT contract address
    const usdtBalance = await getTokenBalance(address, usdtContractAddress);

    // Get BNB balance
    const bnbContractAddress = '0x0987654321098765432109876543210987654321'; // Replace this with the actual BNB contract address
    const bnbBalance = await getTokenBalance(address, bnbContractAddress);

    res.json({
      trxBalance: trxBalanceInTrx,
      usdtBalance: usdtBalance,
      bnbBalance: bnbBalance,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching wallet balance' });
  }
});

// Route to get transaction history
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const transactions = await tronWeb.trx.getTransactionsRelated(address);
    res.json({ transactions });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transaction history' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
