import { Test, TestingModule } from '@nestjs/testing';
import { ComunityController } from './community.controller';

describe('ComunityController', () => {
  let controller: ComunityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunityController],
    }).compile();

    controller = module.get<ComunityController>(ComunityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
