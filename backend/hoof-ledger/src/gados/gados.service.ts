import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGadoDto } from './dto/create-gado.dto';
import { UpdateGadoDto } from './dto/update-gado.dto';
import { Gados } from './schemas/gados.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GadosService {
  constructor(
    @InjectModel('Gados') private readonly gadosModel: Model<Gados>,
  ) {}

  async create(createGadoDto: CreateGadoDto): Promise<CreateGadoDto> {
    try {
      const createdGado = new this.gadosModel(createGadoDto);
      return await createdGado.save();
    } catch (error) {
      throw new BadRequestException({
        statusCode: 400,
        message: error.message,
        error: 'Conflict',
        keyValue: error.keyValue,
        keyPattern: error.keyPattern,
        mongoCode: error.code,
      });
    }
  }

  async findAll(): Promise<any> {
    return await this.gadosModel.find().exec();
  }

  async findOne(id: string) {
    try {
      //.lean() para plain object
      return await this.gadosModel.findById(id).exec();
    } catch {
      return null;
    }
  }

  async update(id: string, updateDGadoto: UpdateGadoDto) {
    await this.gadosModel.updateOne({ _id: id }, updateDGadoto).exec();
    return await this.findOne(id);
  }

  async remove(_id: string) {
    // throw new ForbiddenException('Não pode remover');
    return await this.gadosModel.deleteOne({ _id }).exec();
  }
}
