import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
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
import { OrderService } from '../service/order.service';

@ApiTags('주문')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderFacadeService: OrderFacadeService,
    private readonly orderService: OrderService,
  ) {}

  @ApiOperation({ summary: '주문 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createOrderDto: CreateOrderDto,
  ): Promise<ResponseDto<Order>> {
    const newOrder = await this.orderFacadeService.handleOrderCreate(
      user.id,
      createOrderDto,
    );
    return new ResponseDto<Order>(true, newOrder, 200, '주문 생성 성공');
  }

  @ApiOperation({ summary: '주문 취소' })
  @UseGuards(AuthGuard)
  @Post(':id/cancel')
  async cancel(
    @CurrentUser() user: User,
    @Param('id') orderIdStr: string,
  ): Promise<ResponseDto<Order>> {
    const orderId = parseInt(orderIdStr, 10);
    const canceledOrder = await this.orderFacadeService.handleOrderCancel(
      user.id,
      orderId,
    );
    return new ResponseDto<Order>(true, canceledOrder, 200, '주문 취소 성공');
  }

  @ApiOperation({ summary: '주문 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async getOrders(
    @CurrentUser() user: User,
    @Query('page') pageStr = '1',
    @Query('limit') limitStr = '10',
  ): Promise<ResponseDto<{ orders: Order[]; totalCount: number }>> {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);

    const { orders, totalCount } = await this.orderService.getPaginatedOrders(
      user.id,
      page,
      limit,
    );

    return new ResponseDto<{ orders: Order[]; totalCount: number }>(
      true,
      { orders, totalCount },
      200,
      '주문 조회 성공',
    );
  }
}
