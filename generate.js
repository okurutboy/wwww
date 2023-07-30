 
const TronWeb = require('tronweb');
const bip39 = require('bip39');

// Create a TronWeb instance with any fullNode endpoint and solidityNode endpoint.
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  solidityNode: 'https://api.trongrid.io',
  eventServer: 'https://api.trongrid.io',
});

// Function to generate a Tron address from a BIP39 mnemonic (seed phrase)
async function generateTronAddressFromMnemonic(mnemonic) {
  try {
    // Derive the private key from the mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);
    const privateKey = TronWeb.utils.crypto.getPrivateKeyFromSeed(seed);

    // Create an address from the private key
    const address = tronWeb.address.fromPrivateKey(privateKey);
    return address.base58;
  } catch (error) {
    console.error('Error generating Tron address from mnemonic:', error.message);
    return null;
  }
}

// Replace 'YOUR_MNEMONIC' with your actual BIP39 mnemonic (12 or 24 words).
// const mnemonic = 'YOUR_MNEMONIC';
const mnemonic = 'correct hope fire gauge test vicious essay enlist olive manage upgrade peace';

generateTronAddressFromMnemonic(mnemonic).then((address) => {
  if (address) {
    console.log('Generated Tron Address:', address);
  }
});
