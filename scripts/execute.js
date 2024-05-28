const hre = require("hardhat");

// smart contract nounce now start at 1 after spirious dragon upgrade
//const FACTORY_NOUNCE = 1;

const FACTORY_ADDRESS = "0x179B76d0939E3C88180026059794c2De5a38aaEA";

const EP_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

const PM_ADDRESS = "0x2e081F2bfF46Df0050992D3AC9A39e5226f90CF2";

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const signer0Address = await signer0.getAddress();

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  // we need to determine the address of the smart contract that gets deployed
  // intresting thing about this user op works is we need to actualy come up with the sender address before the sender is created
  // so we have to calculate it here

  // sender address in this case is the acc factory. who is deploying the contract
  // WE DONT NEED THIS CUZ NOW WE ARE USING getSenderAddress from entry point
  // const sender = hre.ethers.getCreateAddress({
  //   from: FACTORY_ADDRESS,
  //   nonce: FACTORY_NOUNCE,
  // });

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");

  // initcode is the first 20 bytes of the Account factory address.
  //Account factory is a contract that deploys other contracts

  // in create sender first 20 bytes of the initCode is going to be the factory
  //and rest is going to be the init calldata thats going to sent over to smart acc factory

  // call data in this is the call data of the transection. this is the call data staring from the smart account on. what do u wana do with the smart account
  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [signer0Address])
      .slice(2);
  let sender;
  try {
    await entryPoint.getSenderAddress(initCode);
  } catch (ex) {
    sender = "0x" + ex.data.slice(-40);
  }

  const code = await ethers.provider.getCode(sender);
  if (code !== "0x") {
    initCode = "0x";
  }

  console.log("Sender: ", sender);

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender, // smart account address
    nonce: "0x" + (await entryPoint.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    paymasterAndData: PM_ADDRESS,
    signature:
      "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };
  const { preVerificationGas, verificationGasLimit, callGasLimit } =
    await ethers.provider.send("eth_estimateUserOperationGas", [
      userOp,
      EP_ADDRESS,
    ]);

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const { maxFeePerGas } = await ethers.provider.getFeeData();
  userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await ethers.provider.send(
    "rundler_maxPriorityFeePerGas"
  );
  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await ethers.provider.send("eth_sendUserOperation", [
    userOp,
    EP_ADDRESS,
  ]);

  setTimeout(async () => {
    const { transactionHash } = await ethers.provider.send(
      "eth_getUserOperationByHash",
      [opHash]
    );

    console.log(transactionHash);
  }, 5000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
