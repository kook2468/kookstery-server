import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { EntityManager } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderService: OrderService,
  ) {}

  async createOrder(
    userId: number,
    createOrderDto: CreateOrderDto,
    manager: EntityManager,
  ): Promise<Order> {}
}
