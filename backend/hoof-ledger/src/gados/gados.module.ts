import { Module } from '@nestjs/common';
import { GadosService } from './gados.service';
import { GadosController } from './gados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Gados, GadosSchema } from './schemas/gados.schemas';
import { AuctionsController } from './auctions.controller';
import { BlockchainModule } from '../shared/blockchain/blockchain.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gados', schema: GadosSchema }]),
    BlockchainModule,
  ],
  controllers: [GadosController, AuctionsController],
  providers: [GadosService],
})
export class GadosModule {}
