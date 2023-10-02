const ethers = require('ethers');
require("dotenv").config({path: '.env'});

// CONNECT TO BLOCKCHAIN
const provider_ganache = process.env.PROVIDER_GANACHE;
const provider_sepolia = process.env.PROVIDER_SEPOLIA;
const keyGanache = process.env.PRIVATE_KEY_GANACHE;
const keySepolia = process.env.PRIVATE_KEY_SEPOLIA;

// BRIDGE SMART CONTRACTS
const ganache_contract_address = process.env.BRIDGE_CONTRACT_GANACHE;
const sepolia_contract_address = process.env.BRIDGE_CONTRACT_SEPOLIA;

// TOKEN ADDRESSES
const token_ganache = process.env.TOKEN_ADRESS_GANACHE;
const token_sepolia = process.env.TOKEN_ADRESS_SEPOLIA;

// ABI
const sepoliaAbi = require('./JSON/SEPOLIA.json');
const ganacheAbi = require('./JSON/GANACHE.json');

const tokenSepoliaAbi = require('./JSON/TOKENSEPOLIA.json');
const tokenGanacheAbi = require('./JSON/TOKENGANACHE.json');

// THE MAIN FUNCTION
const main = async () => {

// CONNECT TO SEPOLIA WALLET
console.log("Connecting to Sepolia TESTNET...");
const sepoliaProvider = new ethers.providers.JsonRpcProvider(provider_sepolia);
const sepoliaWallet = new ethers.Wallet(String(keySepolia), sepoliaProvider);
console.log("Connected! \n");

console.log("Connecting to Ganache TESTNET...");
const ganacheProvider = new ethers.providers.JsonRpcProvider(provider_ganache);
const ganacheWallet = new ethers.Wallet(String(keyGanache), ganacheProvider);
console.log("Connected! \n");

// CONNECT TO THE BRIDGE SMART CONTRACT ON EACH NETWORK
console.log("Connecting to SEPOLIA SMART CONTRACT...");
let sepoliaBridge = new ethers.Contract(sepolia_contract_address, sepoliaAbi, sepoliaWallet);
console.log("Connected! \n");

console.log("Connecting to GANACHE SMART CONTRACT...");
let ganacheBridge = new ethers.Contract(ganache_contract_address, ganacheAbi, ganacheWallet);
console.log("Connected! \n");

// CONNECT TO THE TOKEN SMART CONTRACT ON EACH NETWORK
console.log("Connecting to Sepolia TOKEN SMART CONTRACT...");
let sepoliaToken = new ethers.Contract(token_sepolia, tokenSepoliaAbi, sepoliaWallet);
console.log("Connected! \n");

console.log("Connecting to Ganache TOKEN SMART CONTRACT...");
let ganacheToken = new ethers.Contract(token_ganache, tokenGanacheAbi, ganacheWallet);
console.log("Connected! \n");

// SEND TOKENS FROM SEPOLIA BRIDGE
const sendTokensFromSepolia = async (address, amount) => {
    try {
        // Estimate gas limit
        let gasLimit = await sepoliaBridge.estimateGas.sendTokens(address, amount, {from: sepoliaWallet.address});
        //Mint and transfer coins using ganache and sepolia bridge, and erc20 contract
        let txSepolia = await sepoliaBridge.sendTokens(address, amount, token_sepolia, {from: ganacheWallet.address, gasLimit: gasLimit.toString()});
        let mint = async (token_ganache, amount) => {
            try{
            const signer = new ethers.providers.useWeb3Provider(window.ethereum).getSigner
             const contract = new ethers.Contract(ganache_contract_address, tokenGanacheAbi, signer)
             const tx = await contract.mint(token_ganache, amount)
             tx.wait()
             const hash = tx.hash
             return hash
            }catch(error){
             return error.message
            }
            }
        let txGanache = await ganacheBridge.sendTokens(address, amount, token_ganache, {from: ganacheWallet.address, gasLimit: gasLimit.toString()});
        txSepolia.wait();
        mint.wait();
        txGanache.wait();

    } catch (error) {
        console.log("Error: " + error);
    }
}

// SEND TOKENS FROM GANACHE BRIDGE
const sendTokensFromGanache = async (address, amount) => {
    try {
        // Estimate gas limit
        let gasLimit = await ganacheBridge.estimateGas.sendTokens(address, amount, {from: ganacheWallet.address});
        //Mint and transfer coins using ganache and sepolia bridge, and erc20 contract
        let txGanache = await ganacheBridge.sendTokens(address, amount, token_ganache, {from: ganacheWallet.address, gasLimit: gasLimit.toString()});
        let mint = async (token_sepolia, amount) => {
            try{
            const signer = new ethers.providers.useWeb3Provider(window.ethereum).getSigner
             const contract = new ethers.Contract(sepolia_contract_address, tokenSepoliaAbi, signer)
             const tx = await contract.mint(token_sepolia, amount)
             tx.wait()
             const hash = tx.hash
             return hash
            }catch(error){
             return error.message
            }
            }
        let txSepolia = await sepoliaBridge.sendTokens(address, amount, token_sepolia, {from: ganacheWallet.address, gasLimit: gasLimit.toString()});
        txGanache.wait();
        mint.wait();
        txSepolia.wait();

    } catch (error) {
        console.log("Error: " + error);
    }
}

// LISTEN FOR TRANSFER EVENTS ON SEPOLIA
sepoliaToken.on("Transfer", (from, to, value) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if(String(to) === sepolia_contract_address) {
        try {
            sendTokensFromSepolia(String(info.from), String(info.value));
        } catch (error) {
            console.log("Error on transfer from sepolia bridge: " + error);
        }
    }
  });

// LISTEN FOR TRANSFER EVENTS ON GANACHE
ganacheToken.on("Transfer", (from, to, value) => {
    let info = {
      from: from,
      to: to,
      value: value,
    };

    if(String(to) === ganache_contract_address) {
        try {
            sendTokensFromGanache(String(info.from), String(info.value));
        } catch (error) {
            console.log("Error on transfer from ganache bridge: " + error);
        }
    }
  });
} 

main();