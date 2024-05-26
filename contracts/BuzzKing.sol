// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

import './BuzzBinaryDeployer.sol';
import './BuzzBinary.sol';

import './interfaces/IBuzzBinary.sol';
import './interfaces/IBuzzTokens.sol';
import './interfaces/IETH20.sol';

contract BuzzKing is BuzzBinaryDeployer, Ownable{

    IBuzzTokens immutable public buzzTokens;
    IETH20 immutable public ETH20;
    // mapping(address => mapping(address=>string)) public allMarkets;
    uint256 public K;

    event NewMarket( address buzzMarketAddress, address tokensCreator,string marketType);
    event NewMint(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesOrNoAmount, bool yesOrNo);
    event RedeemDuring(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesOrNoAmount, bool yesOrNo);
    event RedeemAfter(address buzzMarketAddress, address tokensCreator, address buzzUser, uint256 shareAmount, uint256 yesAmount, uint256 noAmount);

    constructor(address _buzzTokensAddress, address _ETH20)Ownable(msg.sender){
        buzzTokens=IBuzzTokens(_buzzTokensAddress);
        ETH20 = IETH20(_ETH20);
    }
    function setK(uint256 _k)public onlyOwner{
        K=_k;
    }
    function createBinary()external returns(address buzzMarketAddress){
        buzzMarketAddress = binaryDeploy(msg.sender, address(this), K);
        // allMarkets[msg.sender][buzzMarketAddress] ='binary';
        buzzTokens.addMarket(msg.sender, buzzMarketAddress, "binary");
        emit NewMarket( buzzMarketAddress,msg.sender,'binary');
    }

    function mintBinaryposition(address tokensCreator, address buzzMarketAddress,uint256 amountTokens, bool yesOrNo)public{
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 burnAmount = amountTokens/100;
        buzzTokens.burnToken(tokensCreator,buzzMarketAddress,burnAmount);
        buzzTokens.transferToContract(tokensCreator, msg.sender, buzzMarketAddress, amountTokens-burnAmount);
        uint256 yesOrNoAdded = IBuzzBinary(buzzMarketAddress).mintPosition(msg.sender, amountTokens, yesOrNo);
        emit NewMint(buzzMarketAddress, tokensCreator, msg.sender, amountTokens, yesOrNoAdded, yesOrNo);

    }
    function redeemBinaryDuring(address tokensCreator, address buzzMarketAddress, uint256 yesOrNoAmount, bool yesOrNo)public{
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        uint256 amountToReturn = IBuzzBinary(buzzMarketAddress).redeemDuring(msg.sender, yesOrNoAmount, yesOrNo);
        buzzTokens.transerFromContract(tokensCreator, msg.sender, buzzMarketAddress, amountToReturn);
        emit RedeemDuring(buzzMarketAddress,tokensCreator,msg.sender,amountToReturn,yesOrNoAmount,yesOrNo);

    }
    function redeemBinaryAfter(address tokensCreator, address buzzMarketAddress)public{
        string memory marketType = buzzTokens.allMarkets(tokensCreator, buzzMarketAddress);
        require(keccak256(abi.encodePacked(marketType)) == keccak256(abi.encodePacked('binary')), "Not a Binary Market");
        (uint256 amountToReturn,uint256 amountToBurn, uint256 yesAmount, uint256 noAmount) = IBuzzBinary(buzzMarketAddress).redeemAfter(msg.sender);
        if(amountToBurn>0){
            buzzTokens.burnTokens(tokensCreator,buzzMarketAddress,amountToBurn);
        }if(amountToReturn>0){
            uint256 marketBalance = buzzTokens.tokensBalance(tokensCreator, buzzMarketAddress);
            if(marketBalance>= amountToReturn*2){
                buzzTokens.transerFromContract(tokensCreator,msg.sender, buzzMarketAddress,amountToReturn*2);
            }else{
                if(marketBalance>0){
                    buzzTokens.burnTokens(tokensCreator,buzzMarketAddress,marketBalance);
                }
                buzzTokens.mintTokens(tokensCreator,msg.sender, amountToReturn*2);
            }
        }
        emit RedeemAfter(buzzMarketAddress,tokensCreator,msg.sender,amountToReturn*2, yesAmount, noAmount);

    }
}