const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

// scripts/index.js
async function main() {
  const ZippaStaking = await ethers.getContractFactory('ZippaStaking');
  const instanceAddress = '0xE3A30D158AaF90dF05cE8d3385E7837678476946';
  const upgraded = await upgrades.upgradeProxy(instanceAddress, ZippaStaking);
  console.log('ZippaStaking instance: ' + upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
