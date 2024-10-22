import { IsNotEmpty } from 'class-validator';

export class CreateCartItemDto {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  //note: string;
}
