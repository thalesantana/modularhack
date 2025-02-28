import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

// ABI dos contratos
// Normalmente, importaríamos de arquivos JSON gerados pelo Hardhat
// Para simplificar, definiremos apenas as funções que usaremos
const CattleNFTAbi = [
  'function mintCattle(address recipient, string memory tokenURI, string memory name, string memory breed, uint256 weight, string memory color, string memory vaccines, string memory feeding) public returns (uint256)',
  'function getCattleData(uint256 tokenId) external view returns (tuple(string name, string breed, uint256 weight, string color, string vaccines, string feeding, bool isForSale))',
  'function setCattleForSale(uint256 tokenId, bool forSale) external',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'event CattleMinted(uint256 indexed tokenId, address owner, string name, string breed)',
];

const CattleAuctionAbi = [
  'function createAuction(uint256 tokenId, uint256 startingPrice, uint256 reservePrice, uint256 duration) external',
  'function getAuction(uint256 tokenId) external view returns (tuple(uint256 tokenId, address seller, uint256 startingPrice, uint256 reservePrice, uint256 highestBid, address highestBidder, uint256 endTime, uint8 status))',
  'function getHighestBid(uint256 tokenId) external view returns (uint256)',
  'function getHighestBidder(uint256 tokenId) external view returns (address)',
  'function getTimeRemaining(uint256 tokenId) external view returns (uint256)',
  'event AuctionCreated(uint256 indexed tokenId, address seller, uint256 startingPrice, uint256 reservePrice, uint256 endTime)',
];

@Injectable()
export class BlockchainService implements OnModuleInit {
  private provider!: ethers.JsonRpcProvider;
  private signer!: ethers.Wallet;
  private cattleNFTContract!: ethers.Contract;
  private cattleAuctionContract!: ethers.Contract;
  private readonly logger = new Logger(BlockchainService.name);
  
  constructor(private configService: ConfigService) {}
  
  async onModuleInit() {
    try {
      await this.initBlockchain();
    } catch (error) {
      this.logger.error('Failed to initialize blockchain service:', error);
    }
  }
  
  private async initBlockchain() {
    const rpcUrl = this.configService.get<string>('SCROLL_RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const cattleNFTAddress = this.configService.get<string>('CATTLE_NFT_ADDRESS');
    const cattleAuctionAddress = this.configService.get<string>('CATTLE_AUCTION_ADDRESS');
    
    if (!rpcUrl || !privateKey || !cattleNFTAddress || !cattleAuctionAddress) {
      throw new Error('Missing blockchain configuration. Check environment variables.');
    }
    
    // Inicializar provider e signer
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.signer = new ethers.Wallet(privateKey, this.provider);
    
    // Inicializar contratos
    this.cattleNFTContract = new ethers.Contract(
      cattleNFTAddress,
      CattleNFTAbi,
      this.signer
    );
    
    this.cattleAuctionContract = new ethers.Contract(
      cattleAuctionAddress,
      CattleAuctionAbi,
      this.signer
    );
    
    this.logger.log('Blockchain service initialized successfully');
    this.logger.log(`Connected to network: ${await this.provider.getNetwork().then(n => n.name)}`);
    this.logger.log(`Using address: ${this.signer.address}`);
  }
  
  /**
   * Mint a new Cattle NFT
   */
  async mintCattleNFT(
    recipient: string,
    tokenURI: string,
    name: string,
    breed: string,
    weight: number,
    color: string,
    vaccines: string,
    feeding: string,
  ): Promise<number> {
    try {
      const tx = await this.cattleNFTContract.mintCattle(
        recipient,
        tokenURI,
        name,
        breed,
        weight,
        color,
        vaccines,
        feeding,
      );
      
      const receipt = await tx.wait();
      
      // Get the token ID from the emitted event
      const event = receipt.logs
        .filter((log: any) => log.fragment?.name === 'CattleMinted')
        .map((log: any) => {
          return {
            tokenId: log.args[0],
            owner: log.args[1],
            name: log.args[2],
            breed: log.args[3],
          };
        })[0];
      
      return event ? event.tokenId : 0;
    } catch (error) {
      this.logger.error('Error minting cattle NFT:', error);
      throw error;
    }
  }
  
  /**
   * Create an auction for a cattle NFT
   */
  async createCattleAuction(
    tokenId: number,
    startingPrice: number,
    reservePrice: number,
    durationInSeconds: number,
  ): Promise<string> {
    try {
      // Convert prices to wei (ETH values to smallest unit)
      const startingPriceWei = ethers.parseEther(startingPrice.toString());
      const reservePriceWei = ethers.parseEther(reservePrice.toString());
      
      const tx = await this.cattleAuctionContract.createAuction(
        tokenId,
        startingPriceWei,
        reservePriceWei,
        durationInSeconds,
      );
      
      const receipt = await tx.wait();
      return tx.hash;
    } catch (error) {
      this.logger.error('Error creating cattle auction:', error);
      throw error;
    }
  }
  
  /**
   * Get cattle data from the blockchain
   */
  async getCattleData(tokenId: number) {
    try {
      const data = await this.cattleNFTContract.getCattleData(tokenId);
      return {
        name: data.name,
        breed: data.breed,
        weight: Number(data.weight),
        color: data.color,
        vaccines: data.vaccines,
        feeding: data.feeding,
        isForSale: data.isForSale,
      };
    } catch (error) {
      this.logger.error(`Error getting cattle data for token ID ${tokenId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get auction data from the blockchain
   */
  async getAuctionData(tokenId: number) {
    try {
      const auction = await this.cattleAuctionContract.getAuction(tokenId);
      const timeRemaining = await this.cattleAuctionContract.getTimeRemaining(tokenId);
      
      return {
        tokenId: Number(auction.tokenId),
        seller: auction.seller,
        startingPrice: ethers.formatEther(auction.startingPrice),
        reservePrice: ethers.formatEther(auction.reservePrice),
        highestBid: ethers.formatEther(auction.highestBid),
        highestBidder: auction.highestBidder,
        endTime: new Date(Number(auction.endTime) * 1000), // Convert to JS Date
        status: ['Active', 'Ended', 'Canceled'][auction.status], // Convert enum to string
        timeRemaining: Number(timeRemaining),
      };
    } catch (error) {
      this.logger.error(`Error getting auction data for token ID ${tokenId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get owner of a cattle NFT
   */
  async getCattleOwner(tokenId: number): Promise<string> {
    try {
      return await this.cattleNFTContract.ownerOf(tokenId);
    } catch (error) {
      this.logger.error(`Error getting owner for token ID ${tokenId}:`, error);
      throw error;
    }
  }
  
  /**
   * Check connection status
   */
  async checkConnection(): Promise<boolean> {
    try {
      const networkName = await this.provider.getNetwork().then(n => n.name);
      const blockNumber = await this.provider.getBlockNumber();
      
      this.logger.log(`Connected to ${networkName}, current block: ${blockNumber}`);
      return true;
    } catch (error) {
      this.logger.error('Blockchain connection error:', error);
      return false;
    }
  }
} 