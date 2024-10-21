import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { UserModule } from 'src/user/user.module';
import { CartService } from './cart.service';
import { AuthModule } from 'src/auth/auth.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem]),
    UserModule,
    AuthModule,
    ProductModule,
  ],
  controllers: [CartController, CartItemController],
  providers: [CartService, CartItemService],
})
export class CartModule {}
