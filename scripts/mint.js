const HDWallet = require("@truffle/hdwallet-provider");
const infuraKey = "12558959612a40819c162e83c68654bb";
//
const fs = require("fs");
const mnemonic = fs.readFileSync("eth-contracts/.secret").toString().trim();
const web3 = require("web3");
const CONTRACT_ADDRESS = "0x97c5E50e8c136FD3eA35cba1E5c4Ff1C35A1C5Bc";
ContractDef = require("../eth-contracts/build/contracts/SolnSquareVerifier.json");

var proofs = [
  require("./proof1.json"),
  require("./proof2.json"),
  require("./proof3.json"),
  require("./proof4.json"),
  require("./proof5.json"),
  require("./proof6.json"),
  require("./proof7.json"),
  require("./proof8.json"),
  require("./proof9.json"),
  require("./proof10.json"),
];

async function main() {
  const provider = new HDWallet({
    mnemonic: { phrase: mnemonic },
    providerOrUrl: `https://rinkeby.infura.io/v3/${infuraKey}`,
  });

  let accounts = provider.getAddresses();

  const web3Instance = new web3(provider);
  const contract = new web3Instance.eth.Contract(
    ContractDef.abi,
    CONTRACT_ADDRESS
  );

  try {
    for (let i = 0; i < proofs.length; i++) {
      let p = proofs[i].proof;

      let result = await contract.methods
        .mintVerifiedToken(
          accounts[0],
          1,
          p.a[0],
          p.a[1],
          p.b[0],
          p.b[1],
          p.c[0],
          p.c[1],
          proofs[i].inputs
        )
        .send({
          from: accounts[0],
          gas: 2999999,
        });

      console.log(result);
    }
  } catch (err) {
    console.log(err);
  }

  console.log("ok");
}

main();
