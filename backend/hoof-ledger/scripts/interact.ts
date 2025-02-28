import { ethers } from "hardhat";
import { EventLog } from "ethers";

// Function to mint a new cattle NFT
async function mintCattle(
  cattleNFTAddress: string,
  recipientAddress: string,
  tokenURI: string,
  name: string,
  breed: string,
  weight: number,
  color: string,
  vaccines: string,
  feeding: string
) {
  console.log("Minting a new cattle NFT...");

  const CattleNFT = await ethers.getContractFactory("CattleNFT");
  const cattleNFT = CattleNFT.attach(cattleNFTAddress);

  const tx = await cattleNFT.mintCattle(
    recipientAddress,
    tokenURI,
    name,
    breed,
    weight,
    color,
    vaccines,
    feeding
  );

  await tx.wait();
  console.log(`Transaction hash: ${tx.hash}`);

  // Get the latest token ID
  const filter = cattleNFT.filters.CattleMinted();
  const events = await cattleNFT.queryFilter(filter);
  const latestEvent = events[events.length - 1];
  
  // Check if the event is an EventLog (which has args property)
  const tokenId = (latestEvent as EventLog).args[0];

  console.log(`Minted cattle NFT with token ID: ${tokenId}`);
  return tokenId;
}

// Function to create an auction for a cattle NFT
async function createAuction(
  cattleAuctionAddress: string,
  cattleNFTAddress: string,
  tokenId: number,
  startingPrice: number,
  reservePrice: number,
  durationInSeconds: number
) {
  console.log(`Creating auction for token ID: ${tokenId}...`);

  const CattleNFT = await ethers.getContractFactory("CattleNFT");
  const cattleNFT = CattleNFT.attach(cattleNFTAddress);

  const CattleAuction = await ethers.getContractFactory("CattleAuction");
  const cattleAuction = CattleAuction.attach(cattleAuctionAddress);

  // Approve the auction contract to transfer the NFT
  const approveTx = await cattleNFT.approve(cattleAuctionAddress, tokenId);
  await approveTx.wait();
  console.log(`Approve transaction hash: ${approveTx.hash}`);

  // Create the auction
  const startingPriceWei = ethers.parseEther(startingPrice.toString());
  const reservePriceWei = ethers.parseEther(reservePrice.toString());

  const tx = await cattleAuction.createAuction(
    tokenId,
    startingPriceWei,
    reservePriceWei,
    durationInSeconds
  );

  await tx.wait();
  console.log(`Create auction transaction hash: ${tx.hash}`);
  console.log(`Auction created for token ID: ${tokenId}`);
}

// Function to place a bid on an auction
async function placeBid(
  cattleAuctionAddress: string,
  tokenId: number,
  bidAmount: number
) {
  console.log(`Placing bid on auction for token ID: ${tokenId}...`);

  const CattleAuction = await ethers.getContractFactory("CattleAuction");
  const cattleAuction = CattleAuction.attach(cattleAuctionAddress);

  const bidAmountWei = ethers.parseEther(bidAmount.toString());

  const tx = await cattleAuction.placeBid(tokenId, {
    value: bidAmountWei,
  });

  await tx.wait();
  console.log(`Place bid transaction hash: ${tx.hash}`);
  console.log(`Bid placed on auction for token ID: ${tokenId}`);
}

// Function to end an auction
async function endAuction(cattleAuctionAddress: string, tokenId: number) {
  console.log(`Ending auction for token ID: ${tokenId}...`);

  const CattleAuction = await ethers.getContractFactory("CattleAuction");
  const cattleAuction = CattleAuction.attach(cattleAuctionAddress);

  const tx = await cattleAuction.endAuction(tokenId);

  await tx.wait();
  console.log(`End auction transaction hash: ${tx.hash}`);
  console.log(`Auction ended for token ID: ${tokenId}`);
}

// Main function to execute the interaction
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Interacting with contracts using account: ${deployer.address}`);

  // Replace these with the actual deployed contract addresses
  const cattleNFTAddress = process.env.CATTLE_NFT_ADDRESS || "";
  const cattleAuctionAddress = process.env.CATTLE_AUCTION_ADDRESS || "";

  if (!cattleNFTAddress || !cattleAuctionAddress) {
    throw new Error("Contract addresses not provided in environment variables");
  }

  // Example interaction: Mint a cattle NFT and create an auction for it
  const tokenId = await mintCattle(
    cattleNFTAddress,
    deployer.address,
    "https://ipfs.io/ipfs/QmYGgEFpz1JcPw8r6r5gKJ6Zu2G7biuQxVRwNQZ5qKrDWL",
    "Brahman Bull #1",
    "Brahman",
    650,
    "White",
    "All vaccinations up to date",
    "Grain and pasture"
  );

  // Create an auction for the minted cattle (starting price: 1 ETH, reserve price: 1.5 ETH, duration: 1 day)
  await createAuction(
    cattleAuctionAddress,
    cattleNFTAddress,
    tokenId,
    1.0,
    1.5,
    86400 // 1 day in seconds
  );

  console.log("Interaction completed successfully!");
}

// Execute the interaction if called directly
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

// Export the functions for use in other scripts
export { mintCattle, createAuction, placeBid, endAuction }; 