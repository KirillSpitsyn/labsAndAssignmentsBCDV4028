# labsAndAssignmentsBCDV4028

Kirill Spitsyn's labs and assignments for the BCDV4028 course

Sorting functionality for lab 1:
![lab1_1](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/b7a173bf-e873-468d-85c6-620f699f61cb)

Removing duplicates for lab 1:
![lab_1_2](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/f4c604b1-6335-4f80-9b40-b52f697276f3)

Lab 2 Screenshoots:
![lab2_1](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/8a125dfc-b817-42e5-b39b-fba2e5f753c6)

![lab2_2](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/c5bfd043-fb12-42a4-af95-847474841967)

Lab 3 Unit tests Demonstration:
![lab3Testing](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/07a116dd-16ee-4a20-82e6-3db8537c9a81)

Lab 3 Simulation Test Demonstration:
![lab3Simulation](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/b58e03e0-f786-4e7d-9f93-fb83a7e19756)

Assignment 1.
My deployment wallet address on Sepolia: 0xa4D9a34F699c37A504773816Fce6A96a24aca564
My deployment wallet address on Ganache: 0x82eb03b49FC1E1444089aAe7617AEB8dDc378bD9

Assignment 1 Testing Bridge Contract. Files can be found in the testAssignment1 folder inside the BCDV4028 Assignment 1 folder. I created 2 
different tokens to test the contract, and I tested functionality for receiving tokens to the bridge smart contract and sending tokens
from the bridge smart contract. Also, I tested that the initial values during contract deployment were set correctly, I tested that
tokens shouldn't be sent if the balance is too low, and I tested that only the wallet can request sending tokens.
![assignment1UnitTests](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/3ebec005-1bac-4ae4-86d3-b04612790cb2)

Assignment 1. Screenshots demonstrating token transfers from Ganache Local Network to Sepolia Network. For this process, I 
created 200 tokens on the Ganache and Sepolia networks, and I transferred 20 TTA tokens from the Ganache local network to the Sepolia network using the bridge contracts
on both networks. The bridge contract receives tokens from the sender on one network (Ganche local Ethereum network or Sepolia Ethereum network), locks them, and then the script gets the Transfer signal for minting tokens
on another blockchain network using a smart contract for creating tokens on another network, and then the bridge on another network receives transferred 
tokens and send them to the destination address using the script.

Minting 200 initial tokens on Sepolia and Ganache networks:
![assignment1Screen1](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/e573972f-56ae-4b69-98d6-5c7de5f8a8dd)
![assignemnt1Screen2](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/75ceaf25-6ff4-4e49-8053-04429b3f88ea)

Token TTA that was bridged from the Ganache local network to the Sepolia network:
![assignment1_11](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/5aa08350-e1ca-40c0-b8ed-4177dde313a5)

Ganache wallet balance updated from 200 initial TTA tokens to 180 TTA tokens:
![scrren1_11](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/7d5f08aa-efe5-44ed-bd1b-36c29e7762bc)
![screen333](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/b9f8f670-79b9-4979-878e-5bee052f39f2)

All transactions for tokens sent on the Ganache local network:
![GanacheTransactionAssignment1](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/2a3b2b19-a41f-468f-b96b-aa1ff824ce8b)

Assignment 1. Transferring 20 TTB tokens from the Sepolia network to the Ganache local network.
Sending 20 TTB tokens from my wallet to the bridge contract on the Sepolia network using the Sepolia bridge smart
contract:
![testFinaaal](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/5d73c8a8-d2c7-4e4c-99ae-85a3fb10b2a2)

Sepolia Etherscan transaction confirmation for sending 20 TTB tokens to the bridge contract:
![ActualTransaction](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/02262d85-26ea-465a-b38f-86cb1a40fae1)

20 TTB tokens were received on the Ganache Local network wallet using the bridge on both networks. The bridge contracts helped to lock tokens in the Sepolia bridge smart contract, mint 
TTB tokens on the Ganache local network and send them to my wallet on the Ganache network.
![receiveTTB](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/498e2dc5-c495-4d96-8e1c-122864bf959c)

The TTB token balance on the Sepolia wallet is updated from 200 TTB tokens to 180 TTB as I sent 20 TTB tokens to Ganache local network wallet using
bridges on Sepolia and Ganache.
![SepoliaTokenBalance](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/1fe32137-a7fd-403b-8026-340d531bd7d7)

Lab 5 Random Words:
![lab5BCDV4028](https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/3960f464-033b-44b6-aeb9-bac0b162564d)

Assignment 2 NFT Minting and Displaying on Account Demonstration:
https://github.com/KirillSpitsyn/labsAndAssignmentsBCDV4028/assets/72778161/18fea807-a44f-4042-b399-d054d2384146


