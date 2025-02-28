import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure private key is available
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
if (!PRIVATE_KEY && process.env.NODE_ENV === "production") {
  console.error("Error: Private key is required for deployment");
  process.exit(1);
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  sourcify: {
    enabled: true
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    scrollSepolia: {
      url: process.env.SCROLL_SEPOLIA_RPC_URL || "https://sepolia-rpc.scroll.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 534351,
    },
    scrollMainnet: {
      url: process.env.SCROLL_MAINNET_RPC_URL || "https://rpc.scroll.io",
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 534352,
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  etherscan: {
    apiKey: {
      scrollSepolia: process.env.SCROLLSCAN_API_KEY || ""
    },
    customChains: [
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://api-sepolia.scrollscan.com/api",
          browserURL: "https://sepolia.scrollscan.com/",
        },
      },
      {
        network: "scrollMainnet",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com/",
        },
      },
    ],
  },
};

export default config;
