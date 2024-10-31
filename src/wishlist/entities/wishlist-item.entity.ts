import { BaseEntity } from '../../common/entities/base.entity';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { Product } from '../../product/entities/product.entity';

@Entity('wishlist_item')
export class WishlistItem extends BaseEntity {
  @ManyToOne(() => Wishlist, (wishlist) => wishlist.wishlistItems, {
    nullable: false,
    eager: true,
  })
  wishlist: Wishlist;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  product: Product;
}
