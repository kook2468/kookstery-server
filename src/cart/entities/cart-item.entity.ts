import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/product/entities/product.entity';

@Entity('cartItem')
export class CartItem extends BaseEntity {
  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  cart: Cart;

  @ApiProperty({ description: '구매 선택 여부' })
  @Column({ default: true })
  isSelected: boolean;

  @ApiProperty({ description: '수량', default: 1 })
  @Column()
  quantity: number;

  @ApiProperty({ description: '카트 아이템 관련 추가 메모' })
  @Column({ nullable: true })
  note: string;

  @ManyToOne(() => Product, (product) => product.cartItems, { nullable: false })
  product: Product;

  @Column('decimal')
  regularPrice: number;

  @Column('decimal', { default: 0 })
  discountPrice: number;

  @Column('decimal')
  finalPrice: number;
}
