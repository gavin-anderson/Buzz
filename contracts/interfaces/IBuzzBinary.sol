// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuzzBinary {
    struct YesNo {
        uint256 yesAmount;
        uint256 noAmount;
    }

    event AnswerSubmitted(bool answer);

    function submitAnswer(bool _finalValue) external;

    function mintPosition(address user, uint256 amount, bool yesOrNo) external returns (uint256 yesOrNoAmountToAdd);

    function redeemDuring(address user, uint256 yesOrNoAmount, bool yesorNo) external returns (uint256 amountReturned);

    function redeemAfter(address user) external returns (uint256 amountReturned);

    function sqrt(uint256 x) external pure returns (uint256);
}
