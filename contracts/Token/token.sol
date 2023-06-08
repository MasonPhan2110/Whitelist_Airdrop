// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MIRL is ERC20, Ownable {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
       _mint(msg.sender, 1000000000000000 * 10**uint(decimals()));
    }
}