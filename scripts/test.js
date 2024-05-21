const hre = require("hardhat");

const ACCOUNT_ADDR = "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.s_counter();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
