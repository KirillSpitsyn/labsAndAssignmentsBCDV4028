//SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

// Interfaces
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract bridgeContractSepolia {

    // Address of my wallet on Sepolia testnet
    address public wallet;

    // My token that will be bridged to Ganache local network
    IERC20 public tokenTTB;

    // Token that will be bridged to this Sepolia network
    IERC20 public tokenTTA;

    // Executed during contract deployment to set wallet where tokens are stored and token contract address 
    constructor(address _wallet, address _tokenTTB) {
        wallet = _wallet;
        tokenTTB = IERC20(_tokenTTB);
    }

    // Event that will be emitted after I send the tokens to the bridge
    event SendTokens(address indexed to, uint256 amount);

    //Function modifier that will allow functions with this modifier to be executed only by my wallet
    modifier onlyWallet() {
        require(msg.sender == wallet, "You are not the wallet owner!");
        _;
    }

    //Function that allow me to send tokens over the bridge with
    //the help of script that listens to send events from both blockchain networks
    function sendTokens(address _to, uint256 _amount, IERC20 _token) external onlyWallet {
        require(_token.balanceOf(address(this)) >= _amount, "Balance of the smart contract is too low to send this amount of tokens!");
        _token.approve(_to, _amount); // Approve the receiver to use tokens
        _token.transferFrom(address(this), _to, _amount); // Send the tokens
        emit SendTokens(_to, _amount);
    }
}