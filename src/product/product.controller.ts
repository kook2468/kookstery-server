import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ProductService } from './product.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('상품')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: '상품 리스트 생성' })
  @Post('/bulk')
  async createProducts(
    @Body() createProductDtos: CreateProductDto[],
  ): Promise<ResponseDto<Product[]>> {
    const products =
      await this.productService.createMultiple(createProductDtos);
    return new ResponseDto<Product[]>(
      true,
      products,
      201,
      '상품 리스트 생성 완료',
    );
  }

  @ApiOperation({ summary: '상품 아이디로 상품 조회' })
  @Get(':productId')
  async getProductById(
    @Param('productId') productId: number,
  ): Promise<ResponseDto<Product>> {
    const product = await this.productService.findById(productId);
    if (!product)
      return new ResponseDto<Product>(
        false,
        null,
        404,
        '해당 상품이 없습니다.',
      );
    return new ResponseDto<Product>(true, product);
  }
}
