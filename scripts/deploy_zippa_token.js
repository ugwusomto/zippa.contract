const { ethers ,  upgrades } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const network_name = hre.network.name;
  let [owner, user1, user2] = await ethers.getSigners();
  const ZippaToken = await ethers.getContractFactory('ZippaToken');
  const zippa = await upgrades.deployProxy(ZippaToken, []);
  await zippa.deployed();
  console.log("Zippa Token Address : ",zippa.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
