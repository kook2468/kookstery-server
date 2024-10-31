import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';

@Entity('wishlist')
export class Wishlist extends BaseEntity {
  @OneToOne(() => User, (user) => user.wishlist, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => WishlistItem, (wishlistItem) => wishlistItem.wishlist)
  wishlistItems: WishlistItem[];
}
