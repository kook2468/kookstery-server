import { IsNotEmpty, Length } from 'class-validator';
import { Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: '카테고리 이름' })
  @IsNotEmpty()
  @Length(1, 30, { message: '카테고리 이름은 30자 이하여야 합니다.' })
  name: string;

  @IsNotEmpty()
  @Length(1, 30, { message: '카테고리 이름(영어)는 30자 이하여야 합니다.' })
  nameEn: string;

  @ApiProperty({ description: '카테고리 설명' })
  @Length(1, 255, { message: '카테고리 설명은 255자 이하여야 합니다.' })
  description: string;

  @ApiProperty({ description: '카테고리 노출 여부' })
  isActive: boolean;

  @ApiProperty({ description: '정렬 순서' })
  sortOrder: number;

  @ApiProperty({ description: '카테고리 배너 주소' })
  bannerUrn: string;
}
