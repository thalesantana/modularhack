import { PartialType } from '@nestjs/mapped-types';
import { CreateGadoDto } from './create-gado.dto';

export class UpdateGadoDto extends PartialType(CreateGadoDto) {}
