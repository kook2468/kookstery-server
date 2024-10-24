import { Test, TestingModule } from '@nestjs/testing';
import { KookCoinRecordService } from './kook-coin-record.service';

describe('KookCoinRecordService', () => {
  let service: KookCoinRecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KookCoinRecordService],
    }).compile();

    service = module.get<KookCoinRecordService>(KookCoinRecordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
