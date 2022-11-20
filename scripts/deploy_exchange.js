const { ethers, upgrades } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const network_name = hre.network.name;
  let [owner, user1, user2] = await ethers.getSigners();
  const feeCollector = owner.address;
  const tokenAddress = owner.address;
  const ExchangeContract = await ethers.getContractFactory('Exchange');
  const exchange = await upgrades.deployProxy(ExchangeContract, []);
  await exchange.deployed();
  console.log("exchange Token Address : ",exchange.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
