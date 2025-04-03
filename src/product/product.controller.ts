import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { ResponseDto } from '../common/dto/response.dto';
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

  @ApiOperation({ summary: '특정 카테고리의 아이디의 상품 리스트 반환' })
  @Get('categories/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryIdParam: string,
    @Query('page') pageStr: string = '0',
    @Query('limit') limitStr: string = '12',
  ): Promise<ResponseDto<Product[]>> {
    const categoryId = Number(categoryIdParam);
    const page = Number(pageStr);
    const limit = Number(limitStr);
    //const products = await this.categoryService.findProductsById(categoryId);
    const products = await this.productService.findProductsByCategoryId(
      categoryId,
      page,
      limit,
    );
    return new ResponseDto<Product[]>(
      true,
      products,
      200,
      `카테고리 아이디가 ${categoryId}인 상품 리스트 조회 완료`,
    );
  }
}
