import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { CartStatus } from 'src/common/enums/cart-status.enum';
import { Expose } from 'class-transformer';
import { ShippingAddress } from 'src/shipping-address/entities/shipping-address.entity';

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

  @ManyToOne(() => ShippingAddress, { nullable: true })
  shippingAddress: ShippingAddress;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { eager: true })
  cartItems: CartItem[];

  //선택된 아이템
  get selectedCartItems(): CartItem[] {
    return this.cartItems.filter((item) => item.isSelected);
  }

  //선택된 아이템의 정가 합
  get totalRegularPrice(): number {
    return this.selectedCartItems.reduce((total, item) => {
      return total + item.regularPrice * item.quantity;
    }, 0);
  }

  //선택된 아이템의 할인금액 합
  get totalDiscountPrice(): number {
    return this.selectedCartItems.reduce((total, item) => {
      return total + item.discountPrice * item.quantity;
    }, 0);
  }

  //선택된 아이템의 최종금액
  get totalFinalPrice(): number {
    return this.selectedCartItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
    }, 0);
  }
}
