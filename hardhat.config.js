require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
        details: { yul: false },
      },
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,  // Custom chain ID, often used in local networks
      port: 8545,     // Specify the port number you want to use
    },
  },
};