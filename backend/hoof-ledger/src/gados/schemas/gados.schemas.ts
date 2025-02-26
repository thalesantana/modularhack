import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GadosDocument = Gados & Document;

@Schema({ timestamps: true, collection: 'gados' })
export class Gados {
  @Prop({ required: true })
  nome: string;

  @Prop()
  nascimento: Date;

  @Prop()
  filiacao: string;

  @Prop()
  raca: string;

  @Prop()
  fotoURI: string;

  @Prop()
  peso: number;

  @Prop({ required: true })
  cor: string;

  @Prop({ required: true })
  vacinas: string;

  @Prop({ required: true })
  alimentacao: string;
}

export const GadosSchema = SchemaFactory.createForClass(Gados);
