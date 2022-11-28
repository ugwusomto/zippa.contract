const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

// scripts/index.js
async function main() {
  const Exchange = await ethers.getContractFactory('Exchange');
  const instanceAddress = '0x9534Bd90c73a180026e921af994Eba877Ab933cC';
  const upgraded = await upgrades.upgradeProxy(instanceAddress, Exchange);

  console.log('Exchange instance: ' + upgraded.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
