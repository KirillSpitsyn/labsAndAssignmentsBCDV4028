// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Sender {
    //state varibles to hold description and id of the sender and receiver, state varibles must be the same for 
    //both receiver and sender to make delegateCalls working
    string public description="Test description";
    uint public id=15;

    //function to set description of sender and receiver 
    function setDescription(string memory _description) external{
        description=_description;
    }    

    //function to set id of sender and receiver 
    function setID(uint _id) external{
        id=_id;
    } 
}

contract Receiver {
    //the same state varibles with Sender
    string public description;
    uint public id;


    //creates a delegatecall to setDescription function in sender contract to set description value 
    //for receiver without declaring setDescription function in Receiver contract
    function setDescriptionUsingSender(address _contract, string calldata _description) external{
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSelector(Sender.setDescription.selector, _description));
            require(success, "Calling delegateCall failed");
    }  

     //creates a delegatecall to setID function in sender contract to set ID value 
     //for receiver without declaring setID function in Receiver contract
     function setIDUsingSender(address _contract, uint _id) external{
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSelector(Sender.setID.selector, _id));
            require(success, "Calling delegateCall failed");
    }  

}
