import { Test, TestingModule } from '@nestjs/testing';
import { KookCoinService } from './kook-coin.service';

describe('KookCoinService', () => {
  let service: KookCoinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KookCoinService],
    }).compile();

    service = module.get<KookCoinService>(KookCoinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
