// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IETH20 {
    // View functions
    function privilegedContract() external view returns (address);

    // State-changing functions
    function setBuzzShares(address _privilegedContract) external;
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function specialMint(address to) external;
}
