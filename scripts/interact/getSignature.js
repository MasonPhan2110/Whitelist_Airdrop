const Web3 = require('web3');

async function main(){
    contractAddress = ""
    let _internalId = ""
    let _typeOfClaim = 0
    let _to = ""
    let _amount =  ethers.utils.parseEther("1000")
    const hashMessage = await Web3.utils.soliditySha3(
       _internalId,
       _typeOfClaim,
       _to,
       _amount
      );
      console.log(hashMessage);
      const privateKey = "5a1d47ed36bae797c576a4fa350721130344781e676bfca5d82f0aa6917e354b"
      const web3 = new Web3("https://data-seed-prebsc-1-s2.binance.org:8545");
        web3.eth.accounts.privateKeyToAccount(privateKey);
      const signature = web3.eth.accounts.sign(hashMessage, privateKey);
      console.log(signature);
}
main()
