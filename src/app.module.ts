import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Category } from './category/entities/category.entity';
import { CategoryModule } from './category/category.module';
import { Product } from './product/entities/product.entity';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CartItem } from './cart/entities/cart-item.entity';
import { Cart } from './cart/entities/cart.entity';
import { WishlistModule } from './wishlist/wishlist.module';
import { WishlistItem } from './wishlist/entities/wishlist-item.entity';
import { Wishlist } from './wishlist/entities/wishlist.entity';
import { KookCoinModule } from './kook-coin/kook-coin.module';
import { KookCoin } from './kook-coin/entities/kook-coin.entity';
import { KookCoinRecord } from './kook-coin/entities/kook-coin-record.entity';
import { ShippingAddressModule } from './shipping-address/shipping-address.module';
import { ShippingAddress } from './shipping-address/entities/shipping-address.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderModule } from './order/order.module';
import { OrderItem } from './order/entities/order-item.entity';
import { Order } from './order/entities/order.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), //환경변수 관리를 위해 사용
    EventEmitterModule.forRoot(), //애플리케이션 내에서 이벤트 시스템 사용하기 위해서 사용 (이벤트 발생시키고 리스닝)
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        User,
        Category,
        Product,
        Cart,
        CartItem,
        Wishlist,
        WishlistItem,
        KookCoin,
        KookCoinRecord,
        ShippingAddress,
        Order,
        OrderItem,
      ], //entities: [__dirname + '/**/*.entity{.ts,.js}'], // typeORM이 구동될 때 인식하도록 할 entity 클래스 경로 지정
      synchronize: false, //서비스 구독 시 소스 코드 기반으로 DB 스키마 동기화할지 여부, PROD에서는 false로 할 것
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
    WishlistModule,
    KookCoinModule,
    ShippingAddressModule,
    OrderModule,
  ], // 이 모듈에서 필요로 하는 providers를 export하는 ipmort 모듈의 목록],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
