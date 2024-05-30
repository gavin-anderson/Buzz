// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuzzBinaryDeployer {

    function parameters() external view returns(
        address creator,
        address buzzKing,
        uint256 yesNoAmountPools

    );
}