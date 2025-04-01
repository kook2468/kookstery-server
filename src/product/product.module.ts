import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
