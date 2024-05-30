// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IBuzzBinaryDeployer.sol';
import './BuzzBinary.sol';

contract BuzzBinaryDeployer is IBuzzBinaryDeployer{
    struct Parameters{
        address creator;
        address buzzKing;
        uint256 yesNoAmountPools;
    }

    Parameters public override parameters;


    function binaryDeploy(address creator, address buzzKing, uint256 yesNoAmountPools) internal returns(address market){
        parameters = Parameters({creator: creator, buzzKing: buzzKing, yesNoAmountPools: yesNoAmountPools});
        market = address(new BuzzBinary());
        delete parameters;
    }
}