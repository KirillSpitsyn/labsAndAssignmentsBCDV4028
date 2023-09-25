// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library ArrayManipulations {
    function sort (uint[] memory arr) pure public returns (uint[] memory) {
        for (uint i=0; i < arr.length-1; i++) {
            for(uint j=0; j < arr.length-i-1; j++) {
                if (arr[j]>arr[j+1]) {
                    uint temporary = arr[j];
                    arr[j]=arr[j+1];
                    arr[j+1]=temporary;
                }
            }
        }
    return arr;
    }

    function remove (uint[] memory arr, uint[] storage temporaryStorage) public returns (uint[] memory) {
        uint[] memory SortedArray=sort(arr);
        temporaryStorage.push(SortedArray[0]);
        for (uint i=1; i<SortedArray.length;i++){
            bool flag=false;
            for(uint j = 0; j < temporaryStorage.length; j++){
                if (SortedArray[i]==temporaryStorage[j]){
                    flag=true;
                }
            }
            if(!flag){
                temporaryStorage.push(SortedArray[i]);
            }
        }
    return temporaryStorage;
    }
}

contract TestSortingRemoving {
    uint[] public testingArray;
    uint[] temporaryStorage;

    constructor(uint[] memory _testArray){
        testingArray=_testArray;
    }

    function testSorting() public returns (uint[] memory) {
        testingArray=ArrayManipulations.sort(testingArray);
        return testingArray;
    }

    function testRemoving() public returns (uint[] memory) {
        testingArray=ArrayManipulations.remove(testingArray,temporaryStorage);
        return testingArray;
    }

}