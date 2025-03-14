import { Module } from '@nestjs/common';
import { WishlistItemController } from './wishlist-item.controller';
import { WishlistItemService } from './wishlist-item.service';
import { WishlistService } from './wishlist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ProductModule } from '../product/product.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, WishlistItem]),
    ProductModule,
    AuthModule,
    UserModule,
  ],
  controllers: [WishlistItemController],
  providers: [WishlistService, WishlistItemService],
})
export class WishlistModule {}
