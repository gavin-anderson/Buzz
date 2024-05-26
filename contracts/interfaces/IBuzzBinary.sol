// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuzzBinary {
    struct YesNo {
        uint256 yesAmount;
        uint256 noAmount;
    }

    // Events
    event AnswerSubmitted(bool answer);

    // View functions
    function BASE() external view returns (uint256);
    function K() external view returns (uint256);
    function creator() external view returns (address);
    function king() external view returns (address);
    function totalYesPool() external view returns (uint256);
    function totalNoPool() external view returns (uint256);
    function finalValue() external view returns (bool);
    function isFinalValueSet() external view returns (bool);
    function addressBalances(address user) external view returns (YesNo memory);

    // State-changing functions
    function submitAnswer(bool _finalValue) external;
    function mintPosition(address user, uint256 amount, bool yesOrNo) external returns (uint256 yesOrNoAmountToAdd);
    function redeemDuring(address user, uint256 yesOrNoAmount, bool yesOrNo) external returns (uint256 amountReturned);
    function redeemAfter(address user) external returns (uint256 amountReturned, uint256 amountToBurn, uint256 yesAmount, uint256 noAmount);
}
