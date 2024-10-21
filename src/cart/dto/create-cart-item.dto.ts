import { IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  productId: number;

  quantity: number;

  //note: string;

  regularPrice: number;

  discountPrice: number;

  finalPrice: number;
}
