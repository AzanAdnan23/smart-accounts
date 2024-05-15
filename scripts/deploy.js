const hre = require("hardhat");

const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
async function main() {
  const af = await hre.ethers.deployContract("EntryPoint");

  await af.waitForDeployment();

  console.log(`AF deployed to ${af.target}`);

  // const pm = await hre.ethers.deployContract("Paymaster");

  // await pm.waitForDeployment();

  // console.log(`PM deployed to ${pm.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
