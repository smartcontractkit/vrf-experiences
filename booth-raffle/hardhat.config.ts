import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
      accounts: {
        accountsBalance: "1000000000000000000",
        count: 1000,
      },
    },
    goerli: {},
  },
};

export default config;
