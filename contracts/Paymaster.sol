// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {
    /**
     * payment validation: check if paymaster agrees to pay.
     * Must verify sender is the entryPoint.
     * Revert to reject this request.
     * Note that bundlers will reject this method if it changes the state, unless the paymaster is trusted (whitelisted)
     * The paymaster pre-pays using its deposit, and receive back a refund after the postOp method returns.
     * param userOp the user operation
     * param userOpHash hash of the user's request data.
     * param maxCost the maximum cost of this transaction (based on maximum gas and gas price from userOp)
     * @return context value to send to a postOp
     *      zero length to signify postOp is not required.
     * @return validationData signature and time-range of this operation, encoded the same as the return value of validateUserOperation
     *      <20-byte> sigAuthorizer - 0 for valid signature, 1 to mark signature failure,
     *         otherwise, an address of an "authorizer" contract.
     *      <6-byte> validUntil - last timestamp this operation is valid. 0 for "indefinite"
     *      <6-byte> validAfter - first timestamp this operation is valid
     *      Note that the validation code cannot use block.timestamp (or block.number) directly.
     */
    function validatePaymasterUserOp(UserOperation calldata, bytes32, uint256)
        external
        pure
        returns (bytes memory context, uint256 validationData)
    {
        //for produnction
        // in userop : userOp.PaymasterAndData : it includes first 20 bytes of the paymaster address
        //and the rest is the data that decides by the payumaster : usually have two things:
        // 1. TimerPeriod which the user operation is valid . the paymaster is willing to pay for this userop
        // 2. Signature: the paymaster sighning with his private key that it is willing to pay for thus userop
        // this paymaster address is later used to call userOperation to call this validaeUserOp against the paymaster

        //paymaster can be a smart conrtract and a paymaster server

        context = new bytes(0);
        validationData = 0;
    }

    /**
     * post-operation handler.
     * Must verify sender is the entryPoint
     * @param mode enum with the following options:
     *      opSucceeded - user operation succeeded.
     *      opReverted  - user op reverted. still has to pay for gas.
     *      postOpReverted - user op succeeded, but caused postOp (in mode=opSucceeded) to revert.
     *                       Now this is the 2nd call, after user's op was deliberately reverted.
     * @param context - the context value returned by validatePaymasterUserOp
     * @param actualGasCost - actual gas used so far (without this postOp call).
     */
    function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external {}
}
