const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const network_name = hre.network.name;
  let [owner, user1, user2] = await ethers.getSigners();
  const feeCollector = owner.address;
  const tokenAddress = owner.address;

  const PresaleContract = await ethers.getContractFactory('ZippaPreSale');
  const presale = await upgrades.deployProxy(PresaleContract, [feeCollector,tokenAddress]);
  await presale.deployed();
  console.log("presale Token Address : ",presale.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
