/**
 * Things to test for the
 * DOMAIN SEPERSTOR FOR THE TOKENS
 */
import chai, { expect } from 'chai';
import {PAIR_ABI} from "./asset/pair"
const { ethers } = require('hardhat');
import { Contract, BigNumber, Wallet } from 'ethers';
import { defaultAbiCoder, keccak256, toUtf8Bytes } from 'ethers/lib/utils';

describe('Router02', () => {
  let poolToken: Contract;
  let factory: Contract;
  let tokenA: Contract;
  let tokenB: Contract;
  let deployer: Wallet;
  let factoryFeeSetter: Wallet;
  let user1: Wallet;
  let user2: Wallet;
  let feeToAddress: string;
  const getAmountOut = (amountIn : BigNumber, reserveIn : BigNumber, reserveOut :BigNumber) => {
      const  amountInWithFee = amountIn.mul(997);
      const numerator : BigNumber = amountInWithFee.mul(reserveOut);
      const denominator : BigNumber = reserveIn.mul(1000).add(amountInWithFee);
      const amountOut = numerator.div(denominator);
      return amountOut;
  }

  before(async () => {
    const signers = await ethers.getSigners();
    deployer = signers[0];
    factoryFeeSetter = signers[0];
    user1 = signers[1];
    user2 = signers[2];
    feeToAddress = factoryFeeSetter.address;
  });

  beforeEach(async () => {
    const Factory = await ethers.getContractFactory('Factory');
    const Pair = await ethers.getContractFactory('Pair');
    const LPTOKEN = await ethers.getContractFactory('LPTOKEN');
    const TOKENA = await ethers.getContractFactory('TokenA');
    const TOKENB = await ethers.getContractFactory('TokenB');

    //pool token -- liquidity
    poolToken = await LPTOKEN.deploy();
    await poolToken.deployed();

    //factory contract
    factory = await Factory.deploy(factoryFeeSetter.address);
    await factory.deployed();

    //tokenA contract
    tokenA = await TOKENA.deploy(BigNumber.from('1000000000000000000000000'));
    await tokenA.deployed();
    await tokenA.mint(BigNumber.from('1000000000000000000000000'),user1.address);

    //tokenb contract
    tokenB = await TOKENB.deploy(BigNumber.from('1000000000000000000000000'));
    await tokenB.deployed();
    await tokenB.mint(BigNumber.from('1000000000000000000000000'),user2.address);
  });

  it('LPTOKEN : name, symbol, decimals, totalSupply, balanceOf, DOMAIN_SEPARATOR, PERMIT_TYPEHASH', async () => {
    expect(await poolToken.name()).to.equal('LPTOKEN Pool Token');
    expect(await poolToken.symbol()).to.equal('POOLTK');
    expect(await poolToken.totalSupply()).to.equal(BigNumber.from('0'));
    expect(await poolToken.decimals()).to.equal(BigNumber.from('18'));
    expect(await poolToken.totalSupply()).to.equal(BigNumber.from('0'));
    expect(await poolToken.balanceOf(deployer?.address)).to.equal(
      BigNumber.from('0')
    );
    const name = await poolToken.name();
  });

  it('FACTORY : should  successfully creacte pool pair', async () => {
      await expect((factory.createPair(tokenA.address,tokenB.address))).to.be.reverted;  // Token is not supported
      await factory.supportToken(tokenA.address);
      console.log("TokenA added as supported token" , tokenA.address);
      await factory.supportToken(tokenB.address);
      console.log("TokenB added as supported token" , tokenB.address);
      const expectedPairAddress : string = "0x6F23E54202015aCE8f03F38FEdaea8c3CcbC061C";
      await expect((factory.createPair(tokenA.address,tokenB.address))).to.emit(factory,"PairCreated");
      const pairAddress : string = await factory.getPair(tokenA.address,tokenB.address);
      console.log("TokenA and TokenB liquidity pool added and pair address generated" , pairAddress);
      expect(pairAddress).to.not.equal("0x0000000000000000000000000000000000000000");
      await expect((factory.createPair(tokenA.address,tokenB.address))).to.be.reverted; 
      await expect((factory.createPair(tokenB.address,tokenA.address))).to.be.reverted; 
      expect(await factory.allPairs(0)).to.equal(pairAddress);
      expect(await factory.allPairsLength()).to.equal(BigNumber.from(1));
  });

   it('FACTORY : should setFee and feeToSetter', async () => {
        await factory.connect(factoryFeeSetter).setFeeTo(feeToAddress);
        await factory.connect(factoryFeeSetter).setFeeToSetter(factoryFeeSetter.address);
        const feeTo =  await factory.feeTo();
        const feeToSetter =  await factory.feeToSetter();
        console.log("Factory fee setter set successfully : ", feeToSetter );
        expect(feeTo).to.equal(feeToAddress);
        expect(feeToSetter).to.equal(factoryFeeSetter.address);
   });

   it('FACTORY : should cost minimum gas to create pair', async () => {
        await factory.supportToken(tokenA.address);
        await factory.supportToken(tokenB.address);
        const tx = await factory.createPair(tokenA.address,tokenB.address);
        const receipt = await tx.wait(); 
        // expect(receipt.gasUsed).to.equal(BigNumber.from("3263367"));
        console.log("Gas cost to create liquidity pool cost : ",receipt.gasUsed.toString())
    });

    it('PAIR : should mint liquidity pool tokens when enough liquidity is provided', async () => {
        // The LP tokens you mint from providing liquidity = (amount of tokens deposited in to the Liquidity Pool)/(amount of tokens in the Liquidity Pool) * (amount of total Liquidity tokens).
        // Or really it's your Liquidity share multiplied by the current amount of Liquidity tokens.
        await factory.supportToken(tokenA.address);
        await factory.supportToken(tokenB.address);
        await factory.createPair(tokenA.address,tokenB.address);
        const pairAddress : string = await factory.getPair(tokenA.address,tokenB.address);
        const pairContract = new ethers.Contract( pairAddress , PAIR_ABI , deployer );
        await tokenA.connect(deployer).transfer(pairAddress,BigNumber.from("4000000000000000000"));
        await tokenB.connect(deployer).transfer(pairAddress,BigNumber.from("1000000000000000000"));
        console.log("User",deployer.address," added liquidty to the pool TokenA and TokenB successfully");
        await expect(pairContract.mint(deployer.address)).to.emit(pairContract,"Mint")
        console.log("User recieved  LP Token : ",(await pairContract.totalSupply()).toString()-(10**3), " Successfully for providing liquidity");
    });

    it.only("shouldPAIR : should swap tokenA for tokenB", async () => {
      // add Liquidity
      await factory.supportToken(tokenA.address);
      await factory.supportToken(tokenB.address);
      await factory.createPair(tokenA.address,tokenB.address);
      const pairAddress : string = await factory.getPair(tokenA.address,tokenB.address);
      const pairContract = new ethers.Contract( pairAddress , PAIR_ABI , deployer );
      await tokenA.connect(deployer).transfer(pairAddress,BigNumber.from("5000000000000000000"));
      await tokenB.connect(deployer).transfer(pairAddress,BigNumber.from("10000000000000000000"));
      expect(await pairContract.mint(deployer.address))

      //swap
      const tokenAToSwap = BigNumber.from("1000000000000000000");
      const expectedAmount =  getAmountOut(tokenAToSwap, BigNumber.from("5000000000000000000"),BigNumber.from("10000000000000000000"));
      await tokenA.connect(user1).transfer(pairAddress,tokenAToSwap);
      console.log("UserA with address ",user1.address,"Transfered TokenA",tokenAToSwap.toString()," to get TokenB");
      console.log("Expected Amount OF TokenB to get :  ",expectedAmount.toString())
      expect(await pairContract.connect(deployer).swap(0,expectedAmount,user1.address,"0x",{gasLimit:3e7}))
      console.log("Swap successfully completed");
      // // await expect(await pairContract.connect(deployer).swap(0,expectedAmount,user1.address,"0x")).to.emit(pairContract,"Swap").withArgs(deployer.address,tokenAToSwap, 0, 0, expectedAmount, user1.address);
      console.log("User1 tokenB balance",(await tokenB.balanceOf(user1.address)).toString())  
    })


});
