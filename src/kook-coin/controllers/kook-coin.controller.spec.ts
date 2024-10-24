import { Test, TestingModule } from '@nestjs/testing';
import { KookCoinController } from './kook-coin.controller';

describe('KookCoinController', () => {
  let controller: KookCoinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KookCoinController],
    }).compile();

    controller = module.get<KookCoinController>(KookCoinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
