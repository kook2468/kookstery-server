import { BadRequestException, Injectable } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderItemService } from './order-item.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { CartService } from 'src/cart/cart.service';
import { CartStatus } from 'src/common/enums/cart-status.enum';
import { KookCoinFacadeService } from 'src/kook-coin/services/kook-coin-facade.service';
import { KookCoinTransactionDto } from 'src/kook-coin/dto/kook-coin-transaction.dto';
import { KookCoinTransactionType } from 'src/common/enums/kook-coin-transaction-type.enum';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { DataSource } from 'typeorm';

@Injectable()
export class OrderFacadeService {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
    private readonly cartService: CartService,
    private readonly kookCoinFacadeService: KookCoinFacadeService,
    private readonly dataSource: DataSource,
  ) {}
  async handleOrderCreate(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Cart 조회
      const cart = await this.cartService.getCurrentCart(userId);

      // 2. Order 생성
      const order = this.orderService.createOrder(
        userId,
        createOrderDto,
        queryRunner.manager,
      );

      // Cart.isSelectedItems 없으면 에러
      if (!cart?.selectedCartItems.length) {
        throw new BadRequestException(
          '주문 아이템이 1개 이상 존재해야 합니다.',
        );
      }

      //orderItem 생성
      const orderItems = await this.orderItemService.createOrderItems(
        userId,
        cart?.selectedCartItems,
        queryRunner.manager,
      );

      // Cart 상태 변경 INACTIVE
      await this.cartService.updateCartStatus(userId, CartStatus.INACTIVE);

      // KookCoin 기록 & 업데이트
      const kookCoinTransactionDto = new KookCoinTransactionDto();
      kookCoinTransactionDto.type = KookCoinTransactionType.SPEND;
      kookCoinTransactionDto.amount = order.totalFinalPrice;
      kookCoinTransactionDto.description = '주문';

      const kookCoin =
        await this.kookCoinFacadeService.handleKookCoinTransaction(
          userId,
          kookCoinTransactionDto,
        );

      // Order 상태변경 CONFIRMED (결제가 있다면 이거 전에 결제해야함)
      const returnOrder = this.orderService.updateOrderStatus(
        order.id,
        OrderStatus.CONFIRMED,
        queryRunner.manager,
      );
      return returnOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('주문 생성 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
