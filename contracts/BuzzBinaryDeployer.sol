// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IBuzzBinaryDeployer.sol';
import './BuzzBinary.sol';

contract BuzzBinaryDeployer is IBuzzBinaryDeployer{
    struct Parameters{
        address creator;
        address positionManager;
    }

    Parameters public override parameters;


    function binaryDeploy(address creator, address positonManager) internal returns(address market){
        parameters = Parameters({creator: creator, positionManager: positonManager});
        market = address(new BuzzBinary());
        delete parameters;
    }
}