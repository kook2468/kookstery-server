import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { Index } from 'typeorm';

export class CreateProductDto {
  @ApiProperty({ description: '카테고리 아이디' })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({ description: '상품 이름' })
  @Length(1, 50, { message: '상품 이름은 50자 이하여야 합니다.' })
  @Index()
  name: string;

  @ApiProperty({ description: '상품 이름(영어)' })
  @Length(1, 50, { message: '상품 이름(영어)는 50자 이하여야 합니다.' })
  nameEn: string;

  @ApiProperty({ description: '상품 설명' })
  @Length(1, 255, { message: '상품 설명은 255자 이하여야 합니다.' })
  description: string;

  @ApiProperty({ description: '상품 노출 여부' })
  isActive: boolean;

  @ApiProperty({ description: '상품 이미지 주소' })
  imageUrn: string;
}
