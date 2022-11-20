// const { ethers, upgrades } = require('hardhat');
// const hre = require('hardhat');

async function main() {
  const network_name = hre.network.name;
  let [owner, user1, user2] = await ethers.getSigners();
  const ZippToken = await ethers.getContractFactory('ZippToken');
  const zipp = await upgrades.deployProxy(ZippToken, []);
  await zipp.deployed();
  console.log("Zipp Token Address : ",zipp.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
