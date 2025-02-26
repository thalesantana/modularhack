/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsDataURI,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import ValidatorMessage from 'src/shared/lang/pt-br/validator.messages';

export class CreateGadoDto {
  @IsString({ message: ValidatorMessage.IsString })
  @MaxLength(255, { message: ValidatorMessage.MaxLength })
  @IsNotEmpty({ message: ValidatorMessage.IsNotEmpty })
  nome: string;

  @IsDataURI()
  nascimento: Date;

  @IsString({ message: ValidatorMessage.IsString })
  filiacao: string;

  @IsString({ message: ValidatorMessage.IsString })
  raca: string;

  @IsString({ message: ValidatorMessage.IsString })
  fotoURI: string;

  @IsNumber()
  peso: number;

  @IsString({ message: ValidatorMessage.IsString })
  cor: string;

  @IsString({ message: ValidatorMessage.IsString })
  vacinas: string;

  @IsString({ message: ValidatorMessage.IsString })
  alimentacao: string;
}
