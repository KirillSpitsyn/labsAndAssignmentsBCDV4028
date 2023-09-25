// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract CallingContract {
    string public message = "Something";

    address public owner = 0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2;

    function set(address _calledAddress) external {
        (bool success, bytes memory returndata) = _calledAddress.delegatecall(
            abi.encodeWithSelector(
                TargetContract.changeMessage.selector,
                "He is Alive"
            )
        );

        // if the function call reverted
        if (success == false) {
            // if there is a return reason string
            if (returndata.length > 0) {
                // bubble up any reason for revert
                assembly {
                    let returndata_size := mload(returndata)
                    revert(add(32, returndata), returndata_size)
                }
            } else {
                revert("Function call reverted");
            }
        }
    }
}

contract TargetContract {
    string public message = "I love solidity";
    address public owner; //0x637CcDeBB20f849C0AA1654DEe62B552a058EA87

    constructor(address _owner) {
        owner = _owner;
    }

    function changeMessage(string calldata _msg) external {
        message = _msg;
        owner = msg.sender;
    }

}
