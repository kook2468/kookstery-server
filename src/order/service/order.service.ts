import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { EntityManager, Repository } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async createOrder(
    userId: number,
    cart: Cart,
    createOrderDto: CreateOrderDto,
    manager: EntityManager,
  ): Promise<Order> {
    console.log('createOrder ==> ');

    const order = manager.create(Order, {
      ...createOrderDto,
      cart,
      user: { id: userId },
      receiverPhone: cart.shippingAddress?.receiverPhone,
      receiverName: cart.shippingAddress?.receiverName,
      fullAddress: `${cart.shippingAddress?.state} ${cart.shippingAddress?.city} ${cart.shippingAddress?.addressStreet} ${cart.shippingAddress?.addressDetail}`,
    });

    // 주문 생성
    const insertResult = await manager.insert(Order, order); //id값 포함 안됐는데도 save 하면 오류나서 일단 insert로 명시해줬음

    // 주문 ID 가져오기
    const newOrderId = insertResult.identifiers[0].id;

    // 주문 객체 생성 후 반환
    const newOrder = { ...order, id: newOrderId };
    return newOrder as Order;
  }

  async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus,
    manager?: EntityManager,
  ): Promise<Order> {
    let result = manager
      ? await manager.update(Order, orderId, {
          status: orderStatus,
        })
      : await this.orderRepository.update(orderId, {
          status: orderStatus,
        });

    if (result.affected === 0) {
      throw new NotFoundException('주문 정보를 찾을 수 없습니다.');
    }

    return manager
      ? manager.findOneBy(Order, { id: orderId })
      : this.orderRepository.findOne({ where: { id: orderId } });
  }

  async findById(orderId: number) {
    return this.orderRepository.findOneBy({ id: orderId });
  }

  async getPaginatedOrders(
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ orders: Order[]; totalCount: number }> {
    const [orders, totalCount] = await this.orderRepository.findAndCount({
      where: { user: { id: userId } },
      take: limit,
      skip: (page - 1) * limit,
      relations: ['orderItems'],
    });

    return { orders: orders, totalCount };
  }
}
