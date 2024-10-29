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
    const order = manager.create(Order, {
      ...createOrderDto,
      cart,
      user: { id: userId },
      receiverPhone: cart.shippingAddress.receiverPhone,
      receiverName: cart.shippingAddress.receiverName,
      fullAddress:
        cart.shippingAddress.addressStreet + cart.shippingAddress.addressDetail,
    });

    return manager.save(Order, order);
  }

  async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus,
    manager: EntityManager,
  ): Promise<Order> {
    const result = await manager.update(Order, orderId, {
      status: orderStatus,
    });

    if (result.affected === 0) {
      throw new NotFoundException('주문 정보를 찾을 수 없습니다.');
    }

    return manager.findOne(Order, { where: { id: orderId } });
  }

  async findById(orderId: number) {
    return this.orderRepository.findOneBy({ id: orderId });
  }
}
