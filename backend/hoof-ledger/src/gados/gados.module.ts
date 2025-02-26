import { Module } from '@nestjs/common';
import { GadosService } from './gados.service';
import { GadosController } from './gados.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GadosSchema } from './schemas/gados.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Gados', schema: GadosSchema }]),
  ],
  controllers: [GadosController],
  providers: [GadosService],
})
export class GadosModule {}
