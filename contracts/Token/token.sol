// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MIRL is ERC20, Ownable {
    address public AirdropContract;

    modifier onlyAirdrop{
        require(msg.sender == AirdropContract || msg.sender == owner(), "Only Airdrop Contract");
        _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
       _mint(msg.sender, 1000000000000000 * 10**uint(decimals()));
    }

    function mint(address _to, uint256 _amount) external onlyAirdrop{
        _mint(_to, _amount);
    }
    function setAirdropContract(address newAirdropContract) external onlyOwner{
        AirdropContract = newAirdropContract;
    }
}