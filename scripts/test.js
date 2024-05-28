const hre = require("hardhat");

const ACCOUNT_ADDR = "0x84dcb23713bbf059137303f0198532c435e8909b";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.s_counter();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
