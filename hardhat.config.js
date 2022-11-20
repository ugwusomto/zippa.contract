require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('@openzeppelin/hardhat-upgrades');
let secret = require('./secret.json');

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: {
    compilers: [
      {
        version: '0.8.5',
      },
      {
        version: '0.8.9',
      },
      {
        version: '0.9.0',
      },
    ],
  },
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    testnet: {
      url: secret.url,
      accounts: [secret.key],
    },
    mainnet: {
      url: secret.url_mainnet,
      accounts: [secret.key_mainnet],
    },
    hardhat: {
      forking: {
        url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        // url : "https://bsc-dataseed.binance.org/",
        blockNumber: 22142683,
      },
    },

    // bscScan : {
    //   apiKey : "DD15ETDTN4FZUSJJR9QYNRWFRWBP2V2KX1"
    // }
  },
  etherscan: {
    url: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    apiKey: {
      bscTestnet: 'HEZD4MNUDTQD51EXYGFXCQGY28SWGEPQJ7',
      bsc: 'HEZD4MNUDTQD51EXYGFXCQGY28SWGEPQJ7',
    },
  },
  include: ['./scripts', './test'],
};

// 0x08e310db9A9DA1426bCBC448b24471ecD320FA83
