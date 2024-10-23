import { Test, TestingModule } from '@nestjs/testing';
import { WishlistItemController } from './wishlist-item.controller';

describe('WishlistItemController', () => {
  let controller: WishlistItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WishlistItemController],
    }).compile();

    controller = module.get<WishlistItemController>(WishlistItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
