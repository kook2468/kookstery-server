import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
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
    const order = await this.orderFacadeService.handleOrderCreate(
      user.id,
      createOrderDto,
    );

    return new ResponseDto<Order>(true, order, 200, '주문 생성 성공');
  }

  @ApiOperation({ summary: '주문 취소' })
  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  async cancel(
    @CurrentUser() user: User,
    @Param('id') orderIdStr: string,
  ): Promise<ResponseDto<Order>> {
    const orderId = parseInt(orderIdStr, 10);
    const order = await this.orderFacadeService.handleOrderCancel(
      user.id,
      orderId,
    );

    return new ResponseDto<Order>(true, order, 200, '주문 취소 성공');
  }
}
