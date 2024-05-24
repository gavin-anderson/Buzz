// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Faucet is Ownable{
    uint public amountToDistribute = 0.1 ether;
    mapping(address => bool) public onetimeClaim;

    constructor() Ownable(msg.sender){}

    receive() external payable {}

    function requestEth(address userWallet)  public onlyOwner{

        require(address(this).balance >= amountToDistribute,"Insufficient balance in faucet");
         require(onetimeClaim[userWallet] == false,"One time Claim");

       (bool success, ) = payable(userWallet).call{value:amountToDistribute }("");
       require(success,"Transfer didn't work");
        onetimeClaim[userWallet] = true;
    }

    // Function to check the balance of the faucet
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
