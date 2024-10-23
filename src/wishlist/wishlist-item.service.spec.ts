import { Test, TestingModule } from '@nestjs/testing';
import { WishlistItemService } from './wishlist-item.service';

describe('WishlistItemService', () => {
  let service: WishlistItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WishlistItemService],
    }).compile();

    service = module.get<WishlistItemService>(WishlistItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
