import { Test, TestingModule } from '@nestjs/testing';
import { OrderFacadeService } from './order-facade.service';

describe('OrderFacadeService', () => {
  let service: OrderFacadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderFacadeService],
    }).compile();

    service = module.get<OrderFacadeService>(OrderFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
