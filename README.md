# CLAIM AIRDROP CONTRACT

A Project that allow claim airdrop.

## Demo website

-
- Token address on Mumbai : 0x2742bd65F0aCEcE4F8847c8a517770F9007fB051
- Airdrop address on Mumbai : 0x506C3Ac029411d0f8f52Fb27d19cE27540647814

## Project structure

The program using the following mechanism to handle the claim airdrop:

1. An `owner` of Airdrop Contract transfer tokens to Airdrop Contract.

2. When a user claim airdrop, they receives MIRL token, the number of tokens that will be in the tier of user (Seed: 1000 MIRl Tokens, Private: 2000 MIRL Tokens). The operation is perform via the `claimAirdrop` functions. -- Airdrop.sol

## Deployment

Deploy contract on bscTestnet:

- To deploy Token Contract: npm run deploy::Token polygonTestnet
- To deploy Airdrop Contract Proxy: npm run deploy::ProxyAirdrop polygonTestnet

## Verify

Verify contract on Mumbai:

- To verify Airdrop Contract Proxy: npm run verify::Airdrop polygonTestnet
- To verify Token Contract: npm run verify::Token polygonTestnet

## Interactive scripts

To generate Signature for claim, run `node scripts/interact/getSignature.js` (change the data inside `getSignature` to get the right signature)

### Environment

Create .env file with these variable

- RPC = ""
- PRIVATE_KEY = ""
- API = ""

## Testing

The testing scripts is located in the `test\` folders

Run `npx hardhat test` to test the project
