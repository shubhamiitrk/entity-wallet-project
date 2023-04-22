// // SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

interface IMasterWallet {
    function executeTransaction(
        address payable target,
        uint256 value,
        bytes calldata data,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract ChildWallet {
    using SafeMath for uint256;
    
    address public owner;
    IMasterWallet public masterWallet;
    mapping(address => uint256) public balances;
    
    event Deposit(address indexed sender, uint256 amount);
    event Withdrawal(address indexed recipient, uint256 amount);
    
    constructor(address masterWalletAddress) {
        owner = msg.sender;
        masterWallet = IMasterWallet(masterWalletAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    function updateOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function deposit() external payable {
        balances[msg.sender] = balances[msg.sender].add(msg.value);
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount, address payable recipient) external onlyOwner {
        require(amount <= balances[msg.sender], "Insufficient balance");
        balances[msg.sender] = balances[msg.sender].sub(amount);
        recipient.transfer(amount);
        emit Withdrawal(recipient, amount);
    }
    
    function submitTransaction(
        address payable target,
        uint256 value,
        bytes calldata data,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external onlyOwner {
        masterWallet.executeTransaction(target, value, data, v, r, s);
    }
    
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }
}
