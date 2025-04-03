import { BaseEntity } from '../../common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import { User } from '../../user/entities/user.entity';
import { Expose, Transform } from 'class-transformer';

@Entity('cart_item')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @ApiProperty({ description: '구매 선택 여부' })
  @Expose()
  @Column({ default: true })
  isSelected: boolean;

  @ApiProperty({ description: '수량', default: 1 })
  @Expose()
  @Column()
  quantity: number;

  @ApiProperty({ description: '카트 아이템 관련 추가 메모' })
  @Expose()
  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Product, {
    nullable: false,
    eager: true,
  })
  @Expose()
  product: Product;

  @Column('decimal')
  @Expose()
  @Transform(({ value }) => Number(value))
  regularPrice: number;

  @Column('decimal', { default: 0 })
  @Transform(({ value }) => Number(value))
  @Expose()
  discountPrice: number;

  @Column('decimal')
  @Transform(({ value }) => Number(value))
  @Expose()
  finalPrice: number;
}
