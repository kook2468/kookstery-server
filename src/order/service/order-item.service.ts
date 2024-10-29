import { Injectable } from '@nestjs/common';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { EntityManager } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@Injectable()
export class OrderItemService {
  async createOrderItems(
    userId: number,
    orderId: number,
    cartItems: CartItem[],
    manager: EntityManager,
  ): Promise<OrderItem[]> {
    const orderItems = cartItems.map((cartItem) => {
      return manager.create(OrderItem, {
        ...cartItem,
        user: { id: userId },
        order: { id: orderId },
      });
    });

    return manager.save(orderItems); //배열은 타입 인자가 필요하지 않음.
  }
}
