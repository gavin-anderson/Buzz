// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuzzTokens {

    // Events
    event Trade(
        address indexed trader,
        address indexed creator,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 creatorEthAmount,
        uint256 supply
    );

    // View functions
    function protocolFeeDestination() external view returns (address);
    function king() external view returns (address);
    function token() external view returns (address);
    function protocolFeePercent() external view returns (uint256);
    function subjectFeePercent() external view returns (uint256);
    function allMarkets(address tokensCreator, address buzzMarket) external view returns (string memory);
    function tokensBalance(address tokensCreator, address holder) external view returns (uint256);
    function tokensSupply(address tokensCreator) external view returns (uint256);
    function curveConstants(address tokensCreator) external view returns (uint256);
    function lastPrice(address tokensCreator) external view returns (uint256);
    function getPrice(uint256 supply, uint256 amount, uint256 curveConstant) external pure returns (uint256);
    function getBuyPrice(address tokensCreator, uint256 amount) external view returns (uint256);
    function getSellPrice(address tokensCreator, uint256 amount) external view returns (uint256);
    function getBuyPriceAfterFee(address tokensCreator, uint256 amount) external view returns (uint256);
    function getSellPriceAfterFee(address tokensCreator, uint256 amount) external view returns (uint256);

    // State-changing functions
    function setKing(address _king) external;
    function setFeeDestination(address _feeDestination) external;
    function setProtocolFeePercent(uint256 _feePercent) external;
    function setCreatorFeePercent(uint256 _feePercent) external;
    function transferToContract(address tokensCreator, address buzzUser, address buzzMarket, uint256 amount) external;
    function transerFromContract(address tokensCreator, address buzzUser, address buzzMarket, uint256 amount) external;
    function burnTokens(address tokensCreator, address buzzMarket, uint256 amount) external;
    function mintTokens(address tokensCreator, address buzzUser, uint256 amount) external;
    function addMarket(address tokensCreator, address buzzMarket, string memory marketType) external;
}
