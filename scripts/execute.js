const hre = require("hardhat");

// smart contract nounce now start at 1 after spirious dragon upgrade
//const FACTORY_NOUNCE = 1;

const FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const EP_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const PM_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

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
    sender = "0x" + ex.data.data.slice(-40);
  }

  const code = await ethers.provider.getCode(sender);
  if (code !== "0x") {
    initCode = "0x";
  }

  console.log("Sender: ", sender);

  // await entryPoint.depositTo(PM_ADDRESS, {
  //   value: hre.ethers.parseEther("100"),
  // });

  // const Account = await hre.ethers.getContractFactory("Account");

  // const userOp = {
  //   sender,
  //   nonce: await entryPoint.getNonce(sender, 0),
  //   initCode,
  //   callData: Account.interface.encodeFunctionData("execute"),
  //   callGasLimit: 400_000,
  //   verificationGasLimit: 400_000,
  //   preVerificationGas: 100_000,
  //   maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
  //   maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
  //   paymasterAndData: PM_ADDRESS,
  //   signature: "0x",
  // };

  // const userOpHash = await entryPoint.getUserOpHash(userOp);
  // userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  // const tx = entryPoint.handleOps([userOp], signer0Address);
  // // const recipt = await tx.wait();
  // // console.log("Recipt: ", recipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
