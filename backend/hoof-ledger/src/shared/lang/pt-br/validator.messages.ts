/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ValidationArguments } from 'class-validator';

export default {
  IsBoolean: (a: ValidationArguments) =>
    `${a.property} precisa ser booleano (true/false).`,
  IsString: (a: ValidationArguments) => `${a.property} precisa ser uma string.`,
  IsNotEmpty: (a: ValidationArguments) => `${a.property} Não pode estar vazio.`,
  MaxLength: (a: ValidationArguments) =>
    `${a.property} pode ter no máximo ${a.constraints[0]}  caracteres.`,
  MinLength: (a: ValidationArguments) =>
    `${a.property} pode ter no mínimo ${a.constraints[0]}  caracteres.`,
  IsEmail: (a: ValidationArguments) => `${a.property} é um email inválido.`,
  IsEnum: (a: ValidationArguments) =>
    `${a.property} tem que ser um enum válido.`,
};
