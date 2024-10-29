import { IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/common/enums/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  status: OrderStatus;
}
