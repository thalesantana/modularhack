import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
import { BlockchainService } from 'src/shared/blockchain/blockchain.service';
import { CreateAuctionDto } from './dto/create-auction.dto';

@Controller('auctions')
export class AuctionsController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Post()
  async createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    try {
      // Verificar se o token existe e pertence a quem está criando o leilão
      const owner = await this.blockchainService.getCattleOwner(createAuctionDto.tokenId);
      
      // Criar o leilão
      const txHash = await this.blockchainService.createCattleAuction(
        createAuctionDto.tokenId,
        createAuctionDto.startingPrice,
        createAuctionDto.reservePrice,
        createAuctionDto.durationInSeconds,
      );

      return {
        success: true,
        message: 'Auction created successfully',
        transactionHash: txHash,
        tokenId: createAuctionDto.tokenId,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create auction: ${error.message}`,
      );
    }
  }

  @Get(':tokenId')
  async getAuction(@Param('tokenId') tokenId: string) {
    try {
      const auctionData = await this.blockchainService.getAuctionData(
        parseInt(tokenId, 10),
      );
      return auctionData;
    } catch (error) {
      throw new BadRequestException(
        `Failed to get auction data: ${error.message}`,
      );
    }
  }

  @Get('/cattle/:tokenId')
  async getCattleData(@Param('tokenId') tokenId: string) {
    try {
      const cattleData = await this.blockchainService.getCattleData(
        parseInt(tokenId, 10),
      );
      return cattleData;
    } catch (error) {
      throw new BadRequestException(
        `Failed to get cattle data: ${error.message}`,
      );
    }
  }
} 