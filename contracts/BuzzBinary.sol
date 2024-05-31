// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import './interfaces/IBuzzBinaryDeployer.sol';

contract BuzzBinary {

    struct YesNo{
        uint256 yesAmount;
        uint256 noAmount;
    }

    mapping(address=>YesNo) public addressBalances;
    uint256 public totalYesPool;
    uint256 public totalNoPool;
    uint256 public immutable startingPosition;
    uint256 public immutable BASE = 10**18;
    uint256 public immutable K;
    address public immutable creator;
    address public immutable king;
    bool public finalValue;
    bool public isFinalValueSet;

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
        uint256 yesNoAmountPools;
        (creator, king, yesNoAmountPools) = IBuzzBinaryDeployer(msg.sender).parameters();
        totalYesPool = yesNoAmountPools;
        totalNoPool = yesNoAmountPools;
        startingPosition = yesNoAmountPools;      
        K = totalYesPool*totalNoPool/1 ether;
        finalValue = false;
        isFinalValueSet = false;
    }

    function submitAnswer(address _creator, bool _finalValue) public onlyKing returns(uint256 amountToBurn){
        require(creator == _creator, "only Creator can SubmitAnswer");
        finalValue = _finalValue;
        isFinalValueSet = true;
        amountToBurn = burnAmount(_finalValue);
    }

    function burnAmount(bool _finalValue)internal  view returns(uint256 amountToBurn){
        require(isFinalValueSet, "Answer has not been submitted. No Burning");

        if(_finalValue && totalYesPool>totalNoPool){
            amountToBurn = totalYesPool- startingPosition;
            return amountToBurn;
        }
        if(!_finalValue && totalNoPool>totalYesPool){
            amountToBurn = totalNoPool - startingPosition;
            return amountToBurn;
        }
        amountToBurn = 0;
    }
    
    function mintPosition(address user, uint256 amount, bool yesOrNo) public onlyKing returns(uint256 yesOrNoAmountToAdd){
        require(user != creator,"Creator can not Participate");
       YesNo storage position = addressBalances[user];
       if(yesOrNo){
        uint256 yesToAdd = totalYesPool - (K * 1 ether / (totalNoPool + amount)) + amount;
        yesOrNoAmountToAdd = yesToAdd;
        position.yesAmount = position.yesAmount + yesToAdd;
        totalNoPool = totalNoPool + amount;
        totalYesPool = K * 1 ether/ totalNoPool;
       }else{
        uint256 noToAdd = totalNoPool  - (K * 1 ether / (totalYesPool + amount)) + amount ;
        yesOrNoAmountToAdd = noToAdd;
        position.noAmount = position.noAmount + noToAdd;
        totalYesPool = totalYesPool + amount;
        totalNoPool = K* 1 ether/ totalYesPool;
       }
        return(yesOrNoAmountToAdd);
    }

    function redeemDuring(address user, uint256 yesOrNoAmount, bool yesOrNo) public onlyKing returns(uint256 amountReturned){

        require(!isFinalValueSet, "Answer has been submitted. Please use redeemAfter");
        YesNo storage position = addressBalances[user];

         if(yesOrNo){
            require(position.yesAmount>=yesOrNoAmount, "Not enough Yes in your positions");
            uint256 discriminate = ((totalYesPool + totalNoPool + yesOrNoAmount )**2)/1 ether - 4*(totalYesPool * totalNoPool/ 1 ether + totalNoPool * yesOrNoAmount/ 1 ether - K);
            uint256 sqRoot = sqrt(discriminate);
            uint256 zero = (totalYesPool + totalNoPool + yesOrNoAmount - sqRoot) / 2;
            amountReturned = zero;
            position.yesAmount = position.yesAmount - yesOrNoAmount;
            totalNoPool = totalNoPool - zero;
            totalYesPool = K* 1 ether / totalNoPool;
        }else{
            require(position.noAmount>=yesOrNoAmount, "Not enough No in your positions");
            uint256 discriminate = (totalYesPool + totalNoPool + yesOrNoAmount)**2/1 ether - 4*(totalYesPool * totalNoPool/ 1 ether + totalYesPool * yesOrNoAmount/ 1 ether - K);
            uint256 sqRoot = sqrt(discriminate);
            uint256 zero = (totalYesPool + totalNoPool + yesOrNoAmount - sqRoot) / 2;
            amountReturned = zero;
            position.noAmount = position.noAmount - yesOrNoAmount;
            totalYesPool = totalYesPool - zero;
            totalNoPool = K * 1 ether / totalYesPool;
        }
        return(amountReturned);
    }
    function redeemAfter(address user)  public onlyKing returns(uint256 amountReturned, uint256 yesAmount, uint256 noAmount){
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
    
    function sqrt(uint256 x) public pure returns (uint256) {
        // Babylonian method
        if (x == 0) {
            return 0;
        }
        uint256 z = (x + 1 ether) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = ((x * 1 ether)/ z + z) / 2;
        }
        return y;
    }
}
