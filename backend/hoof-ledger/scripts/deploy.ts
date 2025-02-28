import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contracts to Scroll...");

  // Deploy the CattleNFT contract
  const CattleNFT = await ethers.getContractFactory("CattleNFT");
  const cattleNFT = await CattleNFT.deploy();
  await cattleNFT.waitForDeployment();

  const cattleNFTAddress = await cattleNFT.getAddress();
  console.log(`CattleNFT deployed to: ${cattleNFTAddress}`);

  // Deploy the CattleAuction contract with the CattleNFT address
  const CattleAuction = await ethers.getContractFactory("CattleAuction");
  const cattleAuction = await CattleAuction.deploy(cattleNFTAddress);
  await cattleAuction.waitForDeployment();

  const cattleAuctionAddress = await cattleAuction.getAddress();
  console.log(`CattleAuction deployed to: ${cattleAuctionAddress}`);

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