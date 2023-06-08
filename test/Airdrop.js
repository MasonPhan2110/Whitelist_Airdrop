const { expect } = require("chai");
const { Signer, Wallet } = require("ethers");
const { ethers } = require("hardhat");
const Web3 = require('web3');

describe("Airdrop",()=>{
  let owner;
  let address1;
  let address2;
  let signer
  let airdrop;
  let airdropCon;
  let token;
  let tokenCon;
  let singerPrivatekey;
  before(async()=>{
    [owner, address1, address2, signer] = await ethers.getSigners();
    singerPrivatekey = "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"
    token = await ethers.getContractFactory("MIRL");
    airdrop = await ethers.getContractFactory("Airdrop");


    tokenCon = await token.deploy("MIRL","MIRL");
    await tokenCon.deployed();

    airdropCon = await airdrop.deploy();
    await airdropCon.deployed();
    await airdropCon.initialize(tokenCon.address, signer.address)

    // send token to Airdrop Contract
    await tokenCon.transfer(airdropCon.address, ethers.utils.parseEther("100000000"))
  })

  describe("Claim Airdrop",()=>{
    it("Address 1 claim airdrop as Seed User", async() => {
      const hashMessage = await Web3.utils.soliditySha3(
        "internalId",
        0, // Seed User
        address1.address,
        ethers.utils.parseEther("1000")
      );
      const web3 = new Web3("http://127.0.0.1:8545/");
      const signature = web3.eth.accounts.sign(hashMessage,singerPrivatekey).signature;
      expect(await airdropCon.connect(address1).claimAirdrop("internalId", 0, ethers.utils.parseEther("1000"), signature)).to.be.ok;
      expect(await tokenCon.balanceOf(address1.address)).to.equal(ethers.utils.parseEther("1000"));

    })
    it("Address 1 claim airdrop fail", async()=>{
      const hashMessage = await Web3.utils.soliditySha3(
        "internalId1",
        0, // Seed User
        address1.address,
        ethers.utils.parseEther("1000")
      );
      const web3 = new Web3("http://127.0.0.1:8545/");
      const signature = web3.eth.accounts.sign(hashMessage,singerPrivatekey).signature;
      await expect(airdropCon.connect(address1).claimAirdrop("internalId1", 0, ethers.utils.parseEther("2000"), signature)).to.be.reverted;
    })
    it("Address 2 claim airdrop as Private User", async() =>{
      const hashMessage = await Web3.utils.soliditySha3(
        "internalId",
        1, // Seed User
        address2.address,
        ethers.utils.parseEther("2000")
      );
      const web3 = new Web3("http://127.0.0.1:8545/");
      const signature = web3.eth.accounts.sign(hashMessage,singerPrivatekey).signature;
      expect(await airdropCon.connect(address2).claimAirdrop("internalId", 1, ethers.utils.parseEther("2000"), signature)).to.be.ok;
      expect(await tokenCon.balanceOf(address2.address)).to.equal(ethers.utils.parseEther("2000"));
    })
    it("Address 2 claim airdrop fail", async()=>{
      const hashMessage = await Web3.utils.soliditySha3(
        "internalId1",
        1, // Seed User
        address2.address,
        ethers.utils.parseEther("2000")
      );
      const web3 = new Web3("http://127.0.0.1:8545/");
      const signature = web3.eth.accounts.sign(hashMessage,singerPrivatekey).signature;
      await expect(airdropCon.connect(address2).claimAirdrop("internalId1", 1, ethers.utils.parseEther("4000"), signature)).to.be.reverted;
    })
    it("BlackList cannot claim airdrop", async()=>{
      // set BlackList
      await airdropCon.setBlackList(address1.address, true);

      // Claim fail
      const hashMessage = await Web3.utils.soliditySha3(
        "internalId1",
        0, // Seed User
        address1.address,
        ethers.utils.parseEther("1000")
      );
      const web3 = new Web3("http://127.0.0.1:8545/");
      const signature = web3.eth.accounts.sign(hashMessage,singerPrivatekey).signature;
      await expect(airdropCon.connect(address1).claimAirdrop("internalId1", 0, ethers.utils.parseEther("1000"), signature)).to.be.reverted;
    })
  })
})