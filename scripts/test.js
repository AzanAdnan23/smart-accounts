const hre = require("hardhat");

const ACCOUNT_ADDR = "0xcafac3dd18ac6c6e92c921884f9e4176737c052c";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.s_counter();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
