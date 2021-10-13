require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.2",
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/93c484632ab74f578b0ab61b1a0e146c',
      accounts: {
	      mnemonic: 'record excuse try include danger agree much rapid globe drastic profit edit'
      }
    },
    ropsten: {
      url: 'https://ropsten.infura.io/v3/93c484632ab74f578b0ab61b1a0e146c',
      accounts: {
	      mnemonic: 'record excuse try include danger agree much rapid globe drastic profit edit'
      }
    }
  },
  etherscan: {
    apiKey: "SIZWBJQRR2DRUHU7DVB7DAIN3VAH3362A4"
  }
};