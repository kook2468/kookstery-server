import { Test, TestingModule } from '@nestjs/testing';
import { KookCoinRecordController } from './kook-coin-record.controller';

describe('KookCoinRecordController', () => {
  let controller: KookCoinRecordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KookCoinRecordController],
    }).compile();

    controller = module.get<KookCoinRecordController>(KookCoinRecordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
