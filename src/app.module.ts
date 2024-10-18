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
import { CartController } from './cart/cart.controller';
import { CartService } from './cart/cart.service';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '0000',
      database: 'test',
      entities: [User, Category, Product], //entities: [__dirname + '/**/*.entity{.ts,.js}'], // typeORM이 구동될 때 인식하도록 할 entity 클래스 경로 지정
      synchronize: true, //서비스 구독 시 소스 코드 기반으로 DB 스키마 동기화할지 여부, PROD에서는 false로 할 것
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    CartModule,
  ], // 이 모듈에서 필요로 하는 providers를 export하는 ipmort 모듈의 목록],

  controllers: [AppController, CartController],
  providers: [AppService, CartService],
})
export class AppModule {}
