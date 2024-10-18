import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, ManyToOne, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

export enum CartStatus {
  ACTIVE = 'active', //기본값
  INACTIVE = 'inactive', //주문이 완료된 후 카트를 비활성화
  PENDING = 'pending', //결제중 작업 대기중인 상태
  DELETED = 'deleted', //카트를 삭제했거나, 일정 기간동안 사용하지 않아 삭제된 상태
}

export class Cart extends BaseEntity {
  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  get totalRegularPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.regularPrice * item.quantity;
    }, 0);
  }

  get totalDiscountPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.discountPrice * item.quantity;
    }, 0);
  }

  get totalFinalPrice(): number {
    return this.cartItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
    }, 0);
  }
}
