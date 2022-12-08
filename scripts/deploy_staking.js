const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const network_name = hre.network.name;
  const ZippaStaking = await ethers.getContractFactory('ZippaStaking');
  const staking = await upgrades.deployProxy(ZippaStaking, []);
  await staking.deployed();
  console.log('ZippaStaking Token Address : ', staking.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
