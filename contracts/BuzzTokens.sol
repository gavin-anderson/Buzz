// SPDX-License-Identifier: MIT
pragma solidity >=0.8.2 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IETH20.sol";
contract BuzzTokens is Ownable {

    address public protocolFeeDestination;
    address public king;
    IETH20 public token;
    uint256 public protocolFeePercent;
    uint256 public creatorFeePercent;
    

    event Trade(address trader, address creator, bool isBuy, uint256 tokenAmount, uint256 ethAmount, uint256 protocolEthAmount, uint256 creatorEthAmount, uint256 supply);
    // tokensCreator => marketAddress=> marketType
    mapping(address => mapping(address=>string)) public allMarkets;
    // tokensCreator => (Holder => Balance)
    mapping(address => mapping(address => uint256)) public tokensBalance;
    // tokensCreator => Supply
    mapping(address => uint256) public tokensSupply;
    // tokensCreator => curveConstant
    mapping(address => uint256) public curveConstants;

    event testEmit(uint256 lastP);

    modifier onlyKing() {
        require(msg.sender == king, "only BuzzKing Contract");
        _;
    }

    constructor(address _ETH20)Ownable(msg.sender){
        token=IETH20(_ETH20);
    }
    function setKing(address _king) public onlyOwner{
        king = _king;
    }
    function setFeeDestination(address _feeDestination) public onlyOwner {
        protocolFeeDestination = _feeDestination;
    }

    function setProtocolFeePercent(uint256 _feePercent) public onlyOwner {
        protocolFeePercent = _feePercent;
    }

    function setCreatorFeePercent(uint256 _feePercent) public onlyOwner {
        creatorFeePercent = _feePercent;
    }

    function getPrice(uint256 supply, uint256 amount, uint256 curveConstant) public pure returns (uint256) {
        uint256 sum1 = curveConstant*(supply**3/10**36)/(2*10**31);
        uint256 sum2 = curveConstant*((supply+amount)**3/10**36)/(2*10**31);
        return sum2-sum1;
    }

    function getBuyPrice(address tokensCreator, uint256 amount) public view returns (uint256) {
        return getPrice(tokensSupply[tokensCreator], amount, curveConstants[tokensCreator]);
    }

    function getSellPrice(address tokensCreator, uint256 amount) public view returns (uint256) {
        return getPrice(tokensSupply[tokensCreator] - amount, amount, curveConstants[tokensCreator]);
    }

    function getBuyPriceAfterFee(address tokensCreator, uint256 amount) public view returns (uint256) {
        uint256 price = getBuyPrice(tokensCreator, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 creatorFee = price * creatorFeePercent / 1 ether;
        return price + protocolFee + creatorFee;
    }

    function getSellPriceAfterFee(address tokensCreator, uint256 amount) public view returns (uint256) {
        uint256 price = getSellPrice(tokensCreator, amount);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 creatorFee = price * creatorFeePercent / 1 ether;
        return price - protocolFee - creatorFee;
    }

    function buyTokens(address tokensCreator, uint256 amount) public {
        require(tokensCreator !=msg.sender, "Creators can not own their own tokens");
        uint256 supply = tokensSupply[tokensCreator];
        if(supply==0){
            curveConstants[tokensCreator] = 1 ether;
            tokensBalance[tokensCreator][msg.sender] = tokensBalance[tokensCreator][msg.sender] + amount - 1;
            tokensBalance[tokensCreator][address(0)] = tokensBalance[tokensCreator][address(0)] + 1;
        }else{
            tokensBalance[tokensCreator][msg.sender] = tokensBalance[tokensCreator][msg.sender] + amount;
        }
        uint256 price = getPrice(supply, amount, curveConstants[tokensCreator]);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 creatorFee = price * creatorFeePercent / 1 ether;
        // require(msg.value >= price + protocolFee + creatorFee, "Insufficient payment");
        
        tokensSupply[tokensCreator] = supply + amount;
        emit Trade(msg.sender, tokensCreator, true, amount, price, protocolFee, creatorFee, supply + amount);

        require(token.transferFrom(msg.sender, protocolFeeDestination, protocolFee), "Failed to send Protocol Fee");
        require(token.transferFrom(msg.sender, tokensCreator, creatorFee),"Failed to send creator Fee");
        require(token.transferFrom(msg.sender, address(this), price),"Failed to send Price");
        
        // (bool success1, ) = protocolFeeDestination.call{value: protocolFee}("");
        // (bool success2, ) = tokensCreator.call{value: creatorFee}("");
        // require(success1 && success2, "Unable to send funds");
    }
    function sellTokens(address tokensCreator, uint256 amount) public {
        uint256 supply = tokensSupply[tokensCreator];
        require(supply > amount, "Cannot sell the last token");
        require(tokensBalance[tokensCreator][msg.sender] >= amount, "Insufficient tokens");
        uint256 price = getPrice(supply - amount, amount, curveConstants[tokensCreator]);
        uint256 protocolFee = price * protocolFeePercent / 1 ether;
        uint256 creatorFee = price * creatorFeePercent / 1 ether;
        tokensBalance[tokensCreator][msg.sender] = tokensBalance[tokensCreator][msg.sender] - amount;
        tokensSupply[tokensCreator] = supply - amount;
        emit Trade(msg.sender, tokensCreator, false, amount, price, protocolFee, creatorFee, supply - amount);

        require(token.transferFrom(address(this), msg.sender, price - protocolFee - creatorFee),"Failed to Transfer To msg.sender");
        require(token.transferFrom(address(this),protocolFeeDestination, protocolFee),"Failed to Transfer To msg.sender");
        require(token.transferFrom(address(this), tokensCreator, creatorFee),"Failed to Transfer To msg.sender");
        
        // (bool success1, ) = msg.sender.call{value: price - protocolFee - creatorFee}("");
        // (bool success2, ) = protocolFeeDestination.call{value: protocolFee}("");
        // (bool success3, ) = tokensCreator.call{value: creatorFee}("");
        // require(success1 && success2 && success3, "Unable to send funds");
    }

    function transferToContract(address tokensCreator, address buzzUser, address buzzMarket, uint256 amount)public onlyKing{
        require(amount<= tokensBalance[tokensCreator][buzzUser], "Not enough Tokens held by user");
        tokensBalance[tokensCreator][buzzUser] = tokensBalance[tokensCreator][buzzUser] - amount;
        tokensBalance[tokensCreator][buzzMarket] = tokensBalance[tokensCreator][buzzMarket] + amount;
    }

    function transerFromContract(address tokensCreator, address buzzUser, address buzzMarket, uint256 amount) public onlyKing{
        require(amount<= tokensBalance[tokensCreator][buzzMarket], "Market Doesn't have enough tokens. It should have minted");
        tokensBalance[tokensCreator][buzzUser] = tokensBalance[tokensCreator][buzzUser] + amount;
        tokensBalance[tokensCreator][buzzMarket] = tokensBalance[tokensCreator][buzzMarket] - amount;
    }

    function burnTokens(address tokensCreator, address buzzMarket, uint256 amount)public onlyKing{
        uint256 lastP = (curveConstants[tokensCreator]*(tokensSupply[tokensCreator]**3/10**36))/(2*10**31);
        tokensBalance[tokensCreator][buzzMarket] = tokensBalance[tokensCreator][buzzMarket] - amount;
        tokensSupply[tokensCreator] = tokensSupply[tokensCreator] - amount;
        updateCurveConstant(tokensCreator, lastP);
    }

    function mintTokens(address tokensCreator, address buzzUser, uint256 amount)public onlyKing{
        uint256 lastP = (curveConstants[tokensCreator]*(tokensSupply[tokensCreator]**3/10**36))/(2*10**31);
        tokensBalance[tokensCreator][buzzUser] = tokensBalance[tokensCreator][buzzUser] + amount;
        tokensSupply[tokensCreator] = tokensSupply[tokensCreator] + amount;
        updateCurveConstant(tokensCreator,lastP);
    }

    function updateCurveConstant(address tokensCreator, uint256 lastP)private{  
        uint256 newCurve = 1 ether *lastP*10**13/((tokensSupply[tokensCreator]**3)/(2*10**36));
        curveConstants[tokensCreator] = newCurve;
    }

   function addMarket(address tokensCreator, address buzzMarket, string memory marketType)public onlyKing{
        allMarkets[tokensCreator][buzzMarket] = marketType;
    }

}