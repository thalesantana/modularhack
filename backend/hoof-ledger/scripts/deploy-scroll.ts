import { ethers, network } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function main() {
  // Check if we're on the Scroll network
  const networkName = network.name;
  const isScroll = networkName.includes("scroll");

  if (!isScroll) {
    console.warn(`Warning: You are deploying to ${networkName}, not a Scroll network!`);
    console.warn("Make sure this is intentional.");
    
    // Small delay to allow user to abort if needed
    await new Promise(resolve => setTimeout(resolve, 3000));
  } else {
    console.log(`Deploying contracts to Scroll (${networkName})...`);
  }

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  const initialBalance = await ethers.provider.getBalance(deployer.address);

  console.log(`Deploying with account: ${deployer.address}`);
  console.log(`Account balance: ${ethers.formatEther(initialBalance)} ETH`);

  // Deploy the CattleNFT contract
  console.log("Deploying CattleNFT contract...");
  const CattleNFT = await ethers.getContractFactory("CattleNFT");
  const cattleNFT = await CattleNFT.deploy();
  await cattleNFT.waitForDeployment();

  const cattleNFTAddress = await cattleNFT.getAddress();
  console.log(`CattleNFT deployed to: ${cattleNFTAddress}`);

  // Deploy the CattleAuction contract with the CattleNFT address
  console.log("Deploying CattleAuction contract...");
  const CattleAuction = await ethers.getContractFactory("CattleAuction");
  const cattleAuction = await CattleAuction.deploy(cattleNFTAddress);
  await cattleAuction.waitForDeployment();

  const cattleAuctionAddress = await cattleAuction.getAddress();
  console.log(`CattleAuction deployed to: ${cattleAuctionAddress}`);

  // Log the final balance and gas used
  const finalBalance = await ethers.provider.getBalance(deployer.address);
  const gasUsed = initialBalance - finalBalance;
  
  console.log(`Deployment gas cost: ${ethers.formatEther(gasUsed)} ETH`);
  console.log(`Final account balance: ${ethers.formatEther(finalBalance)} ETH`);
  
  // Save the deployment information to a file
  const deploymentInfo = {
    network: networkName,
    timestamp: new Date().toISOString(),
    deployer: deployer.address,
    contracts: {
      CattleNFT: cattleNFTAddress,
      CattleAuction: cattleAuctionAddress,
    },
    gasUsed: ethers.formatEther(gasUsed),
  };

  const deploymentPath = path.join(__dirname, "..", "deployment-info.json");
  fs.writeFileSync(
    deploymentPath,
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log(`Deployment information saved to ${deploymentPath}`);

  // Update .env file with contract addresses
  console.log("Updating .env file with contract addresses...");
  try {
    let envContent = "";
    const envPath = path.join(__dirname, "..", ".env");
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, "utf8");
    }

    // Replace or add contract addresses
    if (envContent.includes("CATTLE_NFT_ADDRESS=")) {
      envContent = envContent.replace(/CATTLE_NFT_ADDRESS=.*$/m, `CATTLE_NFT_ADDRESS=${cattleNFTAddress}`);
    } else {
      envContent += `\nCATTLE_NFT_ADDRESS=${cattleNFTAddress}`;
    }

    if (envContent.includes("CATTLE_AUCTION_ADDRESS=")) {
      envContent = envContent.replace(/CATTLE_AUCTION_ADDRESS=.*$/m, `CATTLE_AUCTION_ADDRESS=${cattleAuctionAddress}`);
    } else {
      envContent += `\nCATTLE_AUCTION_ADDRESS=${cattleAuctionAddress}`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(".env file updated successfully!");
  } catch (error) {
    console.error("Failed to update .env file:", error);
  }

  console.log("Deployment completed successfully!");
  
  // Return the contract addresses for verification
  return { cattleNFTAddress, cattleAuctionAddress };
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 