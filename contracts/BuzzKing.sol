// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './BuzzBinaryDeployer.sol';
import './BuzzBinary.sol';

import './interfaces/IBuzzBinary.sol';
import './interfaces/IBuzzShares.sol';

contract BuzzKing is BuzzBinaryDeployer{

    address immutable public buzzSharesAddress;
    mapping(address => mapping(address=>string)) public allMarkets;

    event NewMarket(address marketAddress, string marketType);
    event NewMint(address marketAddress, address subject, address user, uint256 amountSubjectSharesTaken, uint256 yesOrNoGiven, bool yesOrNo);
    event RedeemDuringBinary(address marketAddress, address subject, address user, uint256 yesOrNoTaken, uint256 amountSubjectSharesGiven, bool yesOrNo);
    event RedeemAfterBinary(address marketAddress, address subject, address user, uint256 amountSubjectSharesGiven);
    constructor(address _buzzSharesAddress){
        buzzSharesAddress=_buzzSharesAddress;
    }

    function createBinary()external returns(address marketAddress){
        marketAddress = binaryDeploy(msg.sender, address(this));
        allMarkets[msg.sender][marketAddress] ='binary';
        emit NewMarket(marketAddress,'binary');
    }

    function mintBinaryposition(uint256 amountShares,address subject, address marketAddress, bool yesOrNo)public{
        string memory marketType = allMarkets[subject][marketAddress];
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        IBuzzShares(buzzSharesAddress).transferToContract(subject, msg.sender, marketAddress, amountShares);
        uint256 yesOrNoAdded = IBuzzBinary(marketAddress).mintPosition(msg.sender, amountShares, yesOrNo);
        emit NewMint(marketAddress, subject, msg.sender, amountShares, yesOrNoAdded, yesOrNo);

    }
    function redeemBinaryDuring(address subject, address marketAddress, uint256 yesOrNoAmount, bool yesOrNo)public{
        string memory marketType = allMarkets[subject][marketAddress];
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 amountToReturn = IBuzzBinary(marketAddress).redeemDuring(msg.sender, yesOrNoAmount, yesOrNo)*2;
        IBuzzShares(buzzSharesAddress).transerFromContract(subject, msg.sender, marketAddress, amountToReturn);
        emit RedeemDuringBinary(marketAddress,subject,msg.sender,yesOrNoAmount,amountToReturn,yesOrNo);

    }
    function redeemBinaryAfter(address subject, address marketAddress)public{
        string memory marketType = allMarkets[subject][marketAddress];
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 amountToReturn = IBuzzBinary(marketAddress).redeemAfter(msg.sender);
        IBuzzShares(buzzSharesAddress).transerFromContract(subject, msg.sender, marketAddress, amountToReturn);
        emit RedeemAfterBinary(marketAddress,subject,msg.sender,amountToReturn);

    }
}