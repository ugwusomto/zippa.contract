const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

// scripts/index.js
async function main() {
  const ZippaToken = await ethers.getContractFactory('ZippaToken');
  const instanceAddress = '0x780173c8080aE4401b1907A1BB363974a13c9B13';
  const upgraded = await upgrades.upgradeProxy(instanceAddress, ZippaToken);

  console.log('ZippaToken instance: ' + upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
