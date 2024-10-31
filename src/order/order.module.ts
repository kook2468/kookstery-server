import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { OrderItemService } from './service/order-item.service';
import { OrderFacadeService } from './service/order-facade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { CartModule } from '../cart/cart.module';
import { KookCoinModule } from '../kook-coin/kook-coin.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    AuthModule,
    UserModule,
    CartModule,
    KookCoinModule,
  ],
  providers: [OrderService, OrderItemService, OrderFacadeService],
  controllers: [OrderController],
})
export class OrderModule {}
