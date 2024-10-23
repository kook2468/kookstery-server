import { Injectable } from '@nestjs/common';
import { Wishlist } from './entities/wishlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async findOrCreateUserWishlist(userId: number): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { user: { id: userId } },
    });

    //위시리스트가 없다면 새로 생성
    if (!wishlist) {
      wishlist = this.wishlistRepository.create({ user: { id: userId } });
      await this.wishlistRepository.save(wishlist);
    }

    return wishlist;
  }

  async findWishlistItemByProductId(
    wishlistId: number,
    productId: number,
  ): Promise<boolean> {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id: wishlistId },
      relations: ['wishlistItems'],
    });

    if (!wishlist) {
      //wishlist가 존재하지 않는 경우
      return null;
    }

    // wishlistItems에서  productId가 일치하는 CartItem 찾기
    const isProductInWishlist = wishlist.wishlistItems.some(
      (item) => item.product.id === productId,
    );

    return isProductInWishlist; // 일치하는 wishlistItem 있으면 ID 반환, 없으면 null 반환
  }
}
