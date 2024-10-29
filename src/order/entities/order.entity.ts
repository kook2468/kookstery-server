import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Entity('order')
export class Order extends BaseEntity {
  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @OneToOne(() => Cart, (cart) => cart.order, { nullable: false })
  cart: Cart;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { eager: true })
  orderItems: OrderItem[];

  @Column()
  receiverPhone: string; //수신인 전화번호

  @Column()
  receiverName: string; //수신인 이름

  @Column()
  deliveryNotes: string; //배송 요청사항

  @Column()
  fullAddress: string; //배송지

  get totalRegularPrice(): number {
    return this.orderItems.reduce((total, item) => {
      return total + item.regularPrice * item.quantity;
    }, 0);
  }

  get totalDiscountPrice(): number {
    return this.orderItems.reduce((total, item) => {
      return total + item.discountPrice * item.quantity;
    }, 0);
  }

  get totalFinalPrice(): number {
    return this.orderItems.reduce((total, item) => {
      return total + item.finalPrice * item.quantity;
    }, 0);
  }
}
