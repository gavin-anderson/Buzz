// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import './BuzzBinaryDeployer.sol';
import './BuzzBinary.sol';
import'./NoDelegateCall.sol';

import './interfaces/IBuzzBinary.sol';
import './interfaces/IBuzzTokens.sol';
import './interfaces/IETH20.sol';

contract BuzzKing is BuzzBinaryDeployer, Ownable, NoDelegateCall{

    IBuzzTokens immutable public buzzTokens;
    IETH20 immutable public ETH20;
    // mapping(address => mapping(address=>string)) public allMarkets;

    event NewMarket( address buzzMarketAddress, address tokensCreator,string marketType);
    event NewMint(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesOrNoAmount, bool yesOrNo);
    event RedeemDuring(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesOrNoAmount, bool yesOrNo);
    event RedeemAfter(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesAmount, uint256 noAmount);
    event AnswerSubmitted(bool answer);
    constructor(address _buzzTokensAddress, address _ETH20)Ownable(msg.sender){
        buzzTokens=IBuzzTokens(_buzzTokensAddress);
        ETH20 = IETH20(_ETH20);
    }
  
    function createBinary()external noDelegateCall returns(address buzzMarketAddress){
        uint256 supply = buzzTokens.tokensSupply(msg.sender);
        require(supply>0, "Create Tokens First");
        buzzMarketAddress = binaryDeploy(msg.sender, address(this), supply/100);
        buzzTokens.addMarket(msg.sender, buzzMarketAddress, "binary");
        emit NewMarket( buzzMarketAddress,msg.sender,'binary');
    }

    function submitBinaryAnswer(address buzzMarketAddress, bool finalValue) external{
        string memory marketType = buzzTokens.allMarkets(msg.sender, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        emit AnswerSubmitted(finalValue);
        uint256 amountToBurn = IBuzzBinary(buzzMarketAddress).submitAnswer(msg.sender,finalValue);
        uint256 marketBalance = buzzTokens.tokensBalance(msg.sender, buzzMarketAddress);
        // amountToBurn can be greater than MarketBalance as a result of rounding. This is needed to prevent panic code 0x11
        if(amountToBurn>marketBalance){ 
            buzzTokens.burnTokens(msg.sender,buzzMarketAddress,marketBalance);
        }else{
            buzzTokens.burnTokens(msg.sender,buzzMarketAddress,amountToBurn);
        }
        
    }

    function mintBinaryPosition(address tokensCreator, address buzzMarketAddress,uint256 amountTokens, bool yesOrNo)public{
        require(amountTokens>0, "Select an Amount to Mint");
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 burnAmount = amountTokens/100;
        buzzTokens.transferToContract(tokensCreator, msg.sender, buzzMarketAddress, amountTokens);
        buzzTokens.burnTokens(tokensCreator, buzzMarketAddress, burnAmount);
        uint256 yesOrNoAdded = IBuzzBinary(buzzMarketAddress).mintPosition(msg.sender, amountTokens - burnAmount, yesOrNo);
        emit NewMint(buzzMarketAddress, tokensCreator, msg.sender, amountTokens, yesOrNoAdded, yesOrNo);

    }
    function redeemBinaryDuring(address tokensCreator, address buzzMarketAddress, uint256 yesOrNoAmount, bool yesOrNo)public{
        require(yesOrNoAmount>0, "Can not redeem 0");
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 amountToReturn = IBuzzBinary(buzzMarketAddress).redeemDuring(msg.sender, yesOrNoAmount, yesOrNo);
        buzzTokens.transerFromContract(tokensCreator, msg.sender, buzzMarketAddress, amountToReturn);
        emit RedeemDuring(buzzMarketAddress,tokensCreator,msg.sender,amountToReturn,yesOrNoAmount,yesOrNo);

    }
    function redeemBinaryAfter(address tokensCreator, address buzzMarketAddress)public{
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        (uint256 amountToReturn, uint256 yesAmount, uint256 noAmount) = IBuzzBinary(buzzMarketAddress).redeemAfter(msg.sender);
       if(amountToReturn>0){
            uint256 marketBalance = buzzTokens.tokensBalance(tokensCreator, buzzMarketAddress);
            if(marketBalance>= amountToReturn){
                buzzTokens.transerFromContract(tokensCreator,msg.sender, buzzMarketAddress,amountToReturn);
            }else{
                if(marketBalance>0){
                    buzzTokens.burnTokens(tokensCreator,buzzMarketAddress,marketBalance);
                }
                buzzTokens.mintTokens(tokensCreator,msg.sender, amountToReturn);
            }
        }
        emit RedeemAfter(buzzMarketAddress,tokensCreator,msg.sender,amountToReturn, yesAmount, noAmount);

    }
}