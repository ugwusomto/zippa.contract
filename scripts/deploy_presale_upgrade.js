const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

// scripts/index.js
async function main() {
  const ZippaPreSale = await ethers.getContractFactory('ZippaPreSale');
  const instanceAddress = '0xBB25BE03c454bCEa98E5c798b8f6E64446Da67d4';
  const upgraded = await upgrades.upgradeProxy(instanceAddress, ZippaPreSale);
  console.log('ZippaPreSale instance: ' + upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
