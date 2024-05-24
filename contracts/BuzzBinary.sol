// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import './interfaces/IBuzzBinaryDeployer.sol';

contract BuzzBinary {

    struct YesNo{
        uint256 yesAmount;
        uint256 noAmount;
    }

    mapping(address=>YesNo) addressBalances;
    uint256 totalYesPool;
    uint256 totalNoPool;
    uint256 public immutable BASE = 10**18;
    uint256 public immutable K = 1000000 * 10**18;
    address public immutable creator;
    address public immutable king;
    bool finalValue;
    bool isFinalValueSet;

    event AnswerSubmitted(bool answer);
    // event PositionMinted(address user, uint256 sharesAmount, uint256 yesOrNoAmountToAdd, bool yesOrNo);
    // event RedeemDuring(address user, uint256 amountToReturn, bool yesOrNo);
    modifier onlyCreator() {
        require(msg.sender == creator, "only Creator");
        _;
    }
    modifier onlyKing(){
        require(msg.sender == king, "only Position Manager");
        _;
    }
    constructor(){
        (creator, king) = IBuzzBinaryDeployer(msg.sender).parameters();
        totalYesPool = 1000 * BASE;       
        totalNoPool = 1000 * BASE;
        finalValue = false;
        isFinalValueSet = false;
    }

    function submitAnswer(bool _finalValue) onlyCreator public{
        finalValue = _finalValue;
        isFinalValueSet = true;
        emit AnswerSubmitted(finalValue);
    }
    
    function mintPosition(address user, uint256 amount, bool yesOrNo)onlyKing public returns(uint256 yesOrNoAmountToAdd){
       YesNo storage position = addressBalances[user];
       if(yesOrNo){
        uint256 yesToAdd = totalYesPool * BASE - (K * BASE / (totalNoPool + amount * BASE)) + amount * BASE;
        yesOrNoAmountToAdd = yesToAdd;
        position.yesAmount += yesToAdd;
        totalNoPool = totalNoPool + (amount * BASE);
        totalYesPool = K / totalNoPool;
       }else{
        uint256 noToAdd = totalNoPool * BASE - (K * BASE / (totalYesPool + amount * BASE)) + amount * BASE;
        yesOrNoAmountToAdd = noToAdd;
        position.noAmount +=noToAdd;

        totalYesPool = totalYesPool + (amount * BASE);
        totalNoPool = K / totalYesPool;
       }
        return(yesOrNoAmountToAdd);
    }

    function redeemDuring(address user, uint256 yesOrNoAmount, bool yesOrNo)onlyKing public returns(uint256 amountReturned){

        require(!isFinalValueSet, "Answer has been submitted. Please use redeemAfter");
        YesNo storage position = addressBalances[user];

         if(yesOrNo){
            uint256 discriminate = (totalYesPool + totalNoPool + yesOrNoAmount * BASE)**2 - 4*(totalYesPool * totalNoPool + totalNoPool * yesOrNoAmount * BASE - K);
            uint256 sqRoot = sqrt(discriminate)*10**6;
            uint256 zero = (totalYesPool + totalNoPool + yesOrNoAmount * BASE - sqRoot) / 2;
            amountReturned = zero;
            position.yesAmount = position.yesAmount - zero;
            totalNoPool = totalNoPool - yesOrNoAmount * BASE;
            totalYesPool = K / totalNoPool;
        }else{
            uint256 discriminate = (totalYesPool + totalNoPool + yesOrNoAmount * BASE)**2 - 4*(totalYesPool * totalNoPool + totalYesPool * yesOrNoAmount * BASE - K);
            uint256 sqRoot = sqrt(discriminate)*10**6;
            uint256 zero = (totalYesPool + totalNoPool + yesOrNoAmount * BASE - sqRoot) / 2;
            amountReturned = zero;
            position.noAmount = position.noAmount - zero;
            totalYesPool = totalYesPool - yesOrNoAmount * BASE;
            totalNoPool = K / totalYesPool;
        }
        return(amountReturned);
    }
    function redeemAfter(address user) onlyKing public returns(uint256 amountReturned, uint256 yesAmount, uint256 noAmount){
        require(isFinalValueSet, "Answer has not been submitted. Please use redeemDuring");
        YesNo storage position = addressBalances[user];
        require(position.yesAmount>0 || position.noAmount>0);
        if(finalValue){
            amountReturned = position.yesAmount;
            yesAmount = position.yesAmount;
            noAmount = position.noAmount; 
            position.yesAmount = 0;
            position.noAmount = 0;

        }else{
            amountReturned = position.noAmount; 
             yesAmount = position.yesAmount;
            noAmount = position.noAmount; 
            position.yesAmount = 0;
            position.noAmount = 0;
        }
        return(amountReturned, yesAmount, noAmount);
    }
    

    function sqrt(uint256 x) internal pure returns (uint256) {
        // Babylonian
        
        if (x == 0) {
            return 0;
        }
        x = x / 10**12;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
}
