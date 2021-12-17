// SPDX-License-Identifier: MIT

pragma solidity ^ 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract YieldToken is ERC20, Ownable {
uint256 public constant decimal = 18;
address public adminAddr = 0xD4577dA97872816534068B3aa8c9fFEd2ED7860C;
address public farmAddr = 0xA58ee9834F6D52cF936e538908449E60D9e4A6Bf;
address public marketAddr = 0x39Ca53E1ad736fbB8A189C470a982AF0f7c866d2;
address public LIQAddr = 0x39Ca53E1ad736fbB8A189C470a982AF0f7c866d2;
uint256 private mintAmount = 1e8;

  constructor() ERC20("Cronos", "CNS") {
    _mint(adminAddr, mintAmount * (10 ** decimal));
  }

//   function mint(uint256 _mintAmount) public payable {
//     _mint(msg.sender, _mintAmount * (10 ** decimal));
//   }

  function transfer(address _to, uint256 _value) public override returns(bool)
  {
    require(_to != address(0), 'ERC20: to address is not valid');
    require(_value <= balanceOf(msg.sender), 'ERC20: insufficient balance');
    uint256 LIQAmount = _value * 4 /100;
    uint256 marketAmount = _value * 3 /100;
    uint256 farmAmount = _value * 3 /100;
    uint256 realValue = _value * 90 / 100;
    _transfer(msg.sender, _to, realValue);
    _transfer(msg.sender, LIQAddr, LIQAmount);
    _transfer(msg.sender, farmAddr, farmAmount);
    _transfer(msg.sender, marketAddr, marketAmount);
    return true;
  }

  function setLIQAddress(address _LIQAddr) public onlyOwner {
    LIQAddr = _LIQAddr;
  }

  function setFarmAddress(address _farmAddr) public onlyOwner {
    farmAddr = _farmAddr;
  }

  function setMarketAddress(address _marketAddr) public onlyOwner {
    marketAddr = _marketAddr;
  }

}