import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GadosService } from './gados.service';
import { CreateGadoDto } from './dto/create-gado.dto';
import { UpdateGadoDto } from './dto/update-gado.dto';

@Controller('gados')
export class GadosController {
  constructor(private readonly gadosService: GadosService) {}

  @Post()
  create(@Body() createGadoDto: CreateGadoDto): Promise<any> {
    return this.gadosService.create(createGadoDto);
  }

  @Get()
  findAll() {
    return this.gadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gadosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateGadoDto: UpdateGadoDto) {
    return await this.gadosService.update(id, updateGadoDto);
  }

  @Delete(':id')
  // @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.gadosService.remove(id);
  }
}
