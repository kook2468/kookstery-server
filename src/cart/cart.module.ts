import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserModule } from '../user/user.module';
import { CartService } from './cart.service';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { ShippingAddressModule } from '../shipping-address/shipping-address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    UserModule,
    AuthModule,
    ProductModule,
    ShippingAddressModule,
  ],
  controllers: [CartController, CartItemController],
  providers: [CartService, CartItemService],
  exports: [CartService],
})
export class CartModule {}
