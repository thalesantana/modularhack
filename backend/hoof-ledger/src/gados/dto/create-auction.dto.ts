import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  tokenId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  startingPrice: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  reservePrice: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @Min(3600) // Mínimo de 1 hora
  durationInSeconds: number;
} 