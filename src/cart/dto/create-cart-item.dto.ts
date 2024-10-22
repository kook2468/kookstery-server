import { IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsNotEmpty()
  regularPrice: number;

  @IsNotEmpty()
  discountPrice: number;

  @IsNotEmpty()
  finalPrice: number;

  //note: string;
}
