import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { User } from 'src/user/entities/user.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { WishlistService } from './wishlist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from 'src/product/product.service';
import { LargeNumberLike } from 'crypto';

@Injectable()
export class WishlistItemService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepository: Repository<WishlistItem>,
    private readonly wishlistService: WishlistService,
    private readonly productServce: ProductService,
  ) {}

  async createWishlistItemOne(
    user: User,
    wishlistItemDto: CreateWishlistItemDto,
  ): Promise<WishlistItem> {
    const { productId } = wishlistItemDto;

    const product = await this.productServce.findById(productId);

    if (!product) {
      throw new NotFoundException(
        `해당 상품(id=${productId}이 존재하지 않습니다.`,
      );
    }

    const wishlist = await this.wishlistService.findOrCreateUserWishlist(
      user.id,
    );

    const isProductInWishlist =
      await this.wishlistService.findWishlistItemByProductId(
        wishlist.id,
        productId,
      );

    if (isProductInWishlist) {
      throw new ConflictException(
        `해당 상품(id=${productId})이 위시리스트에 존재합니다.`,
      );
    }

    const wishlistItem = this.wishlistItemRepository.create({
      wishlist,
      product,
    });

    return this.wishlistItemRepository.save(wishlistItem);
  }

  async getWishlistItems(
    wishlistId: number,
    page: number,
    limit: number,
  ): Promise<{ items: WishlistItem[]; totalCount: number }> {
    const [wishlistItems, totalCount] =
      await this.wishlistItemRepository.findAndCount({
        where: { wishlist: { id: wishlistId } },
        take: limit, // 가져올 레코드 수
        skip: (page - 1) * limit, // 건너뛸 레코드 수
      });

    return { items: wishlistItems, totalCount };
  }

  async deleteWishlistItemOne(itemId: number) {
    const result = await this.wishlistItemRepository.delete(itemId);

    console.log('result : ', result);
    if (result.affected === 0) {
      //해당 아이템이 존재하지 않음
      throw new NotFoundException(
        `위시리스트 아이템 (Id = ${itemId}) 이 존재하지 않습니다.`,
      );
    }
  }
}
