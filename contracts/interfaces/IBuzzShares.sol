// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IBuzzShares {
    event Trade(
        address indexed trader,
        address indexed subject,
        bool isBuy,
        uint256 shareAmount,
        uint256 ethAmount,
        uint256 protocolEthAmount,
        uint256 subjectEthAmount,
        uint256 supply
    );

    function protocolFeeDestination() external view returns (address);

    function king() external view returns (address);

    function protocolFeePercent() external view returns (uint256);

    function subjectFeePercent() external view returns (uint256);

    function setKing(address _king) external;

    function setFeeDestination(address _feeDestination) external;

    function setProtocolFeePercent(uint256 _feePercent) external;

    function setSubjectFeePercent(uint256 _feePercent) external;

    function getPrice(uint256 supply, uint256 amount) external pure returns (uint256);

    function getBuyPrice(address sharesSubject, uint256 amount) external view returns (uint256);

    function getSellPrice(address sharesSubject, uint256 amount) external view returns (uint256);

    function getBuyPriceAfterFee(address sharesSubject, uint256 amount) external view returns (uint256);

    function getSellPriceAfterFee(address sharesSubject, uint256 amount) external view returns (uint256);

    function buyShares(address sharesSubject, uint256 amount) external payable;

    function sellShares(address sharesSubject, uint256 amount) external payable;

    function transferToContract(address shareSubject, address caller, address buzzMarket, uint256 amount) external;
    
    function transerFromContract(address shareSubject, address caller, address buzzMarket, uint256 amount) external;
}
