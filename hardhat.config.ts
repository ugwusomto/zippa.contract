import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
let secret = require("./secret.json")
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.4.18",
      },
      {
        version: "0.5.16",
      },
      {
        version: "0.6.6",
      },
      {
        version: "0.8.0",
      },
    ],
    settings: {
      evmVersion : "istanbul"
    },
  },
  networks:{
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    testnet : {
      url : "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts : [secret.key],
      gas: 2100000
    },
    mainnet : {
      url : "https://bsc-dataseed.binance.org/",
      accounts : [secret.key]
    },
    matic: {
      url: "https://speedy-nodes-nyc.moralis.io/3c8c8bc1029a6a43aaadf357/polygon/mumbai",
      accounts: [secret.key]
    },
    polygon: {
      url: "https://polygon-rpc.com",
      accounts: [secret.key]
    },
    hardhat: {
      forking: {
        url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
    },
  },
  etherscan: {
    apiKey: {
        bsc: "HEZD4MNUDTQD51EXYGFXCQGY28SWGEPQJ7",
        bscTestnet:"HEZD4MNUDTQD51EXYGFXCQGY28SWGEPQJ7"
    }
  }
};

export default config;
