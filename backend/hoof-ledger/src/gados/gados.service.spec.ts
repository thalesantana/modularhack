import { Test, TestingModule } from '@nestjs/testing';
import { GadosService } from './gados.service';

describe('GadosService', () => {
  let service: GadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GadosService],
    }).compile();

    service = module.get<GadosService>(GadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
