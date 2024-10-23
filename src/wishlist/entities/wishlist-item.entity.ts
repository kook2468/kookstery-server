import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('wishlist-item')
export class WishlistItem extends BaseEntity {
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishlistItems, {
    nullable: false,
    eager: true,
  })
  wishlist: Wishlist;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  product: Product;
}
