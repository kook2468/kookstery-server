import { IsNotEmpty } from 'class-validator';

export class CreateWishlistItemDto {
  @IsNotEmpty()
  productId: number;
}
