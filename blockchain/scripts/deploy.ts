import { ethers } from "hardhat";

async function main() {
  const cerberusPay = await ethers.deployContract("CerberusPay");

  await cerberusPay.waitForDeployment();

  console.log(`Deployed to ${cerberusPay.target}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
