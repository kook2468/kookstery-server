import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';

@Entity('order_item')
export class OrderItem extends BaseEntity {
  @ManyToOne(() => Order, (order) => order.orderItems, { nullable: false })
  order: Order;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, {
    nullable: false,
    eager: true,
  })
  product: Product;

  @Column('decimal')
  regularPrice: number;

  @Column('decimal', { default: 0 })
  discountPrice: number;

  @Column('decimal')
  finalPrice: number;
}
