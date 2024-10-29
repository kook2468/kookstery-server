import { IsNotEmpty } from 'class-validator';
import { CartStatus } from 'src/common/enums/cart-status.enum';

export class UpdateCartStatusDto {
  @IsNotEmpty()
  status: CartStatus;
}
