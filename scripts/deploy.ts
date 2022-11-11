const hre = require('hardhat');
import { Contract, BigNumber, Wallet } from 'ethers';
async function main() {
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  const Factory = await hre.ethers.getContractFactory('Factory');
  const TOKENA = await hre.ethers.getContractFactory('TokenA');
  const TOKENB = await hre.ethers.getContractFactory('TokenB');

  const factory = await Factory.deploy(deployer.address);
  await factory.deployed();

  console.log('Factory Address deployed to:', factory.address);
  console.log('Deploying contracts with the account:', deployer.address);

  //deploy two tokens to be traded 
  const tokenA = await TOKENA.deploy(BigNumber.from('1000000000000000000000000'));
  await tokenA.deployed();
  console.log('TokenA Address deployed to:', tokenA.address);


  //tokenb contract
  const tokenB = await TOKENB.deploy(BigNumber.from('1000000000000000000000000'));
  await tokenB.deployed();
  console.log('TokenB Address deployed to:', tokenB.address);


  await factory.connect(deployer).supportToken(tokenA.address); 
  await factory.connect(deployer).supportToken(tokenB.address); 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
