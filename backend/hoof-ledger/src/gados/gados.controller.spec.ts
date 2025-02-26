import { Test, TestingModule } from '@nestjs/testing';
import { GadosController } from './gados.controller';
import { GadosService } from './gados.service';

describe('GadosController', () => {
  let controller: GadosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GadosController],
      providers: [GadosService],
    }).compile();

    controller = module.get<GadosController>(GadosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
