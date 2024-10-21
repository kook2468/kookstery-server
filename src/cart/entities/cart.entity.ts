import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CartStatus } from 'src/common/enums/cart-status.enum';

@Entity('cart')
export class Cart extends BaseEntity {
  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus; //pending, active인 카트는 유저당 하나씩만 존재함. (둘다 가질 수 없다.)

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  //정가 합
  get totalRegularPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.regularPrice * item.quantity;
    }, 0);
  }

  //할인금액 합
  get totalDiscountPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.discountPrice * item.quantity;
    }, 0);
  }

  //최종금액
  get totalFinalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
    }, 0);
  }
}
