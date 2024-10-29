import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { OrderFacadeService } from '../service/order-facade.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { Order } from '../entities/order.entity';

@ApiTags('주문')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderFacadeService: OrderFacadeService) {}
  @ApiOperation({ summary: '주문 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto<Order>> {
    const order = this.orderFacadeService.createOrder(user.id, CreateOrderDto);
    return new ResponseDto<Order>(true, order, 200, '주문 생성 성공');
  }
}
