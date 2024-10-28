import { Expose } from 'class-transformer';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { Category } from 'src/category/entities/category.entity';
import { BaseEntity } from 'src/common/entities/base.entity';
import { makeId, slugify } from 'src/utils/helpers';
import { BeforeInsert, Column, Entity, Index, ManyToOne } from 'typeorm';

@Entity('product')
export class Product extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Index()
  @Column()
  slug: string;

  @Column()
  name: string;

  @Column()
  nameEn: string;

  @Column()
  description: string;

  @Column()
  isActive: boolean;

  @Column({ nullable: true })
  imageUrn: string;

  @Column()
  regularPrice: number;

  @Column()
  discountPrice: number;

  @Column()
  finalPrice: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  cartItems: CartItem[];

  @Expose()
  get url(): string {
    return `/product/${this.identifier}/${this.slug}`;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.nameEn);
  }
}
