const ethers = require("ethers");
const solc = require("solc");
const solidityContract = require("./solidityContract");
const private = require("../private");

async function deployContract(args) {
  const toAddress = args.toAddress;
  const hash = args.hash;
  const value = args.value;

  const provider = ethers.getDefaultProvider("kovan");
  const wallet = new ethers.Wallet(private.KOVAN_PRIVATE_KEY, provider);

  const input = solidityContract(toAddress, hash).replace(
    /(\r\n\t|\n|\r\t)/gm,
    ""
  );

  const output = solc.compile(input, 1);

  let bytecode;
  let abi;
  for (const contractName in output.contracts) {
    bytecode = output.contracts[contractName].bytecode;
    abi = JSON.parse(output.contracts[contractName].interface);
  }
  bytecode = "0x" + bytecode;

  const factory = new ethers.ContractFactory(abi, bytecode, wallet);
  const contract = await factory.deploy({
    value: ethers.utils.parseEther(value.toString())
  });

  await contract.deployed();

  return {
    address: contract.address,
    abi,
    bytecode
  };
}

module.exports = deployContract;
