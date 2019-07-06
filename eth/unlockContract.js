const ethers = require("ethers");
const private = require("../private");

async function unlockContract(args) {
  const secret = "0x" + args.secret;
  const contractAddress = args.contractAddress;
  const abi = args.abi;

  const provider = ethers.getDefaultProvider("kovan");
  const wallet = new ethers.Wallet(private.KOVAN_PRIVATE_KEY, provider);

  // https://docs.ethers.io/ethers.js/html/api-contract.html
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const contractWithSigner = contract.connect(wallet);

  // call the solidty withdraw function
  const tx = await contractWithSigner.withdraw(secret);

  console.log(tx);

  return tx.hash;
}

module.exports = unlockContract;
