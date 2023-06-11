const Web3 = require('web3');

async function main(){
    let _internalId = "dfd"
    let _typeOfClaim = 0
    let _to = "0x5729214E4f0687DCcD990c8fD69bc6A4d90c2e9A"
    let _amount =  "1000"
    const hashMessage = await Web3.utils.soliditySha3(
       _internalId,
       _typeOfClaim,
       _to,
       _amount
      );
      console.log(hashMessage);
      const privateKey = "0x027b5fb43361d28f93568c7a750cf5ff780448ae35d18754105a62fddf2b4a04"
      const web3 = new Web3("https://polygon-mumbai.infura.io/v3/df725fecdde44a6981a09a2874b1c10c");
      const signature = web3.eth.accounts.sign(hashMessage, privateKey);
      console.log(signature);
}
main()
