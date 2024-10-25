import { Test, TestingModule } from '@nestjs/testing';
import { KookCoinFacadeService } from './kook-coin-facade.service';

describe('KookCoinFacadeService', () => {
  let service: KookCoinFacadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KookCoinFacadeService],
    }).compile();

    service = module.get<KookCoinFacadeService>(KookCoinFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
