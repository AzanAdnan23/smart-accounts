const hre = require("hardhat");

const ACCOUNT_ADDR = "0xeedc3bf99c02d12cfaf0c9915cc6887b985e81cc";

async function main() {
  const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDR);
  const count = await account.s_counter();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
