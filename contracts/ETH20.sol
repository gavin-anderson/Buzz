// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ETH20 is ERC20, Ownable{
    address public buzzTokens;
    address public king;
    mapping(address=>bool) specialMintList;
    modifier onlyBuzzTokens() {
        require(msg.sender == buzzTokens, "only BuzzTokens Contract ETH20");
        _;
    }
    modifier onlyKing(){
      require(msg.sender == king, "only BuzzKing Contract ETH20");
      _;
    }

    constructor(string memory name, string memory symbol) ERC20(name, symbol) Ownable(msg.sender){}

    function setBuzzTokens(address _buzzTokens) external onlyOwner {
        buzzTokens = _buzzTokens;
    }
    function setKing(address _king)external onlyOwner{
      king=_king;
    }

  function transferFrom(address from, address to, uint256 amount) public override onlyBuzzTokens returns(bool){
    _transfer(from,to,amount);
    return true;
  }
  function specialMint(address to) public onlyOwner{
    require(specialMintList[to] == false,"Already got ETH20");
    _mint(to,2.5 ether);
  }
}