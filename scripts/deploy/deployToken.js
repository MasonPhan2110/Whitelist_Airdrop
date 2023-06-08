const { ethers } = require("hardhat");
const fs = require("fs");
require('dotenv').config();

async function main() {
 let name = "MIRL"
 let symbol = "MIRL"
 const Token = await ethers.getContractFactory("MIRL");
 const token = await Token.deploy(name, symbol)
 await token.deployed();

 console.log("Token deployed to:", token.address);
 fs.writeFileSync(
    "./scripts/data/deployToken.json",
    JSON.stringify({ TokenAddress: token.address })
  );
}

main();