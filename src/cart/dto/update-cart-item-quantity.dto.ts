import { IsNotEmpty, IsPositive } from 'class-validator';

export class UpdateCartItemQuantityDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  @IsPositive() //양수인지 검증
  quantity: number;
}
