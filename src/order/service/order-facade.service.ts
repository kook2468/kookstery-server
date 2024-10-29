import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  /* 주문 생성 */
  async handleOrderCreate(
    userId: number,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      /* 1. Order 생성 */
      const cart = await this.cartService.getCurrentCart(userId);

      if (!cart) {
        throw new NotFoundException('활성화 카트가 존재하지 않습니다.');
      }

      const order = await this.orderService.createOrder(
        userId,
        cart,
        createOrderDto,
        queryRunner.manager,
      );

      // Cart.isSelectedItems 없으면 에러
      if (!cart?.selectedCartItems.length) {
        throw new BadRequestException(
          '주문 아이템이 1개 이상 존재해야 합니다.',
        );
      }

      /* 2. OrderItem 생성 */
      await this.orderItemService.createOrderItems(
        userId,
        order.id,
        cart?.selectedCartItems,
        queryRunner.manager,
      );

      /* 3. Cart 상태 변경 INACTIVE */
      await this.cartService.updateCartStatus(userId, CartStatus.INACTIVE);

      /* 4. KookCoin 기록 & 업데이트 */
      const kookCoinTransactionDto = new KookCoinTransactionDto();
      kookCoinTransactionDto.type = KookCoinTransactionType.SPEND;
      kookCoinTransactionDto.amount = Math.abs(order.totalFinalPrice) * -1; //항상 음수
      kookCoinTransactionDto.description = '주문';

      await this.kookCoinFacadeService.handleKookCoinTransaction(
        userId,
        kookCoinTransactionDto,
      );

      /* 5. Order 상태변경 CONFIRMED (결제가 있다면 이거 전에 결제해야함) */
      const returnOrder = this.orderService.updateOrderStatus(
        order.id,
        OrderStatus.CONFIRMED,
        queryRunner.manager,
      );

      return returnOrder;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('주문 생성 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }

  async handleOrderCancel(userId: number, orderId: number): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Order 조회
      const order = await this.orderService.findById(orderId);

      /* 1. KookCoin 기록 & 업데이트 */
      const kookCoinTransactionDto = new KookCoinTransactionDto();
      kookCoinTransactionDto.type = KookCoinTransactionType.REFUND;
      kookCoinTransactionDto.amount = Math.abs(order.totalFinalPrice); //항상 양수
      kookCoinTransactionDto.description = '주문 취소';

      await this.kookCoinFacadeService.handleKookCoinTransaction(
        userId,
        kookCoinTransactionDto,
      );

      /* 2. Order 상태변경 CANCELD */
      const returnOrder = this.orderService.updateOrderStatus(
        order.id,
        OrderStatus.CANCELED,
        queryRunner.manager,
      );

      return returnOrder;
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException('주문 취소 중 오류가 발생했습니다.');
    } finally {
      await queryRunner.release();
    }
  }
}
