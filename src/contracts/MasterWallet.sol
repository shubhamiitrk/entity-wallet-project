// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IChildWallet {
    function executeTransaction(
        address payable target,
        uint256 value,
        bytes calldata data,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;
}

contract MasterWallet {
    address public owner;
    mapping(address => bool) public childWallets;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier onlyChildWallet() {
        require(childWallets[msg.sender], "Only registered child wallets can call this function");
        _;
    }

    function updateOwner(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function registerChildWallet(address childWalletAddress) external onlyOwner {
        childWallets[childWalletAddress] = true;
    }

    function unregisterChildWallet(address childWalletAddress) external onlyOwner {
        delete childWallets[childWalletAddress];
    }

    function executeTransaction(
        address payable target,
        uint256 value,
        bytes calldata data,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external onlyChildWallet {
        bytes32 hash = keccak256(abi.encodePacked(target, value, data));
        address signer = ecrecover(hash, v, r, s);

        require(signer == msg.sender, "Invalid signer");

        (bool success,) = target.call{value: value}(data);
        require(success, "Transaction execution failed");
    }
}

