// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";

contract Account is IAccount {
    uint256 public s_counter;
    address owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function validateUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 missingAccountFunds)
        external
        returns (uint256 validationData)
    {
        return 0;
    }

    function execute() external {
        s_counter++;
    }
}

contract AccountFactory {
    event AccountCreated(address account);

    function createAccount(address owner) external returns (address) {
        Account account = new Account(owner);

        return address(account);
    }
}
