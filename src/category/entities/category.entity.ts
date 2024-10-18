import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product/entities/product.entity';
import { makeId, slugify } from 'src/utils/helpers';
import { BeforeInsert, Column, Entity, Index, OneToMany } from 'typeorm';

@Entity('category')
export class Category extends BaseEntity {
  @Index()
  @Column()
  identifier: string;

  @Index()
  @Column()
  slug: string;

  @ApiProperty({ description: '카테고리명' })
  @Column()
  name: string;

  @ApiProperty({ description: '카테고리명(English)' })
  @Column()
  nameEn: string;

  @ApiProperty({ description: '카테고리 페이지 설명' })
  @Column({ nullable: true, type: 'text' })
  description: string;

  @ApiProperty({ description: '정렬 순서' })
  @Column()
  sortOrder: number;

  @ApiProperty({ description: '노출 여부' })
  @Column()
  isActive: boolean;

  @ApiProperty({ description: '배너 이미지 Urn' })
  @Column({ nullable: true })
  bannerUrn: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @Expose()
  get url(): string {
    return `/category/${this.name}/${this.identifier}/${this.slug}`;
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }

  @BeforeInsert()
  makeIdAndSlug() {
    this.identifier = makeId(7);
    this.slug = slugify(this.nameEn);
  }
}
