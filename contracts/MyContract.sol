// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

contract MyContract {
    uint256 public value;
    address public owner;
    
    event ValueChanged(address indexed changer, uint256 newValue);
    error Unauthorized(address caller);

    modifier onlyOwner() {
        if(msg.sender != owner) revert Unauthorized(msg.sender);
        _;
    }

    constructor(uint256 _initialValue) {
        owner = msg.sender;
        value = _initialValue;
        emit ValueChanged(msg.sender, _initialValue);
    }

    function setValue(uint256 _newValue) external onlyOwner {
        value = _newValue;
        emit ValueChanged(msg.sender, _newValue);
    }

    function getValue() external view returns(uint256) {
        return value;
    }

    function transferOwnership(address _newOwner) external onlyOwner {
        owner = _newOwner;
    }
}