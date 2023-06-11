const { ethers, upgrades } = require("hardhat");
const fs = require("fs");

async function main() {

 let file = fs.readFileSync(
    "./scripts/data/deployToken.json",
    "utf8"
 );
 let data = JSON.parse(file);
    
 if (!data || !data.TokenAddress) throw new Error("Invalid JSON data");
 let TokenAddress = data.TokenAddress
 let signer = "0xa1D7E1d8353522f9E6c2C0f75f67507e50Ba4739"

 const Airdrop = await ethers.getContractFactory("Airdrop");

 console.log("Deploying Proxy Airdrop...");

 const airdrop = await upgrades.deployProxy(Airdrop,[TokenAddress, signer], {
  initializer: "initialize",
});
 await airdrop.deployed();

 console.log("Airdrop Proxy deployed to:", airdrop.address);

 fs.writeFileSync(
    "./scripts/data/deployAirdropProxy.json",
    JSON.stringify({ AirdropProxy: airdrop.address })
  );
}

main();