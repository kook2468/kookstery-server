import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { ResponseDto } from '../common/dto/response.dto';
import { CategoryService } from './category.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from '../product/entities/product.entity';

@ApiTags('카테고리')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: '카테고리 리스트 불러오기' })
  @ApiResponse({
    status: 200,
    description: '모든 카테고리 리스트',
    type: ResponseDto<Category[]>,
    example: [
      {
        id: 1,
        name: '환상의 물건창고',
        description: '판타지에서만 보던 상상 속의 물건들이 여기 있습니다!',
        sortOrder: 1,
        isActive: true,
        bannerUrn: null,
      },
    ],
  })
  @Get()
  async getAllCategories(): Promise<ResponseDto<Category[]>> {
    const categories = await this.categoryService.findAll();
    return new ResponseDto<Category[]>(true, categories);
  }

  @ApiOperation({ summary: '카테고리 리스트 생성' })
  @ApiResponse({
    status: 201,
    type: ResponseDto<Category[]>,
    example: [{}],
  })
  @Post('/bulk')
  async createCategories(
    @Body() createCategoryDtos: CreateCategoryDto[],
  ): Promise<ResponseDto<Category[]>> {
    const categories =
      await this.categoryService.createMultiple(createCategoryDtos);
    return new ResponseDto<Category[]>(
      true,
      categories,
      201,
      '카테고리 생성 성공',
    );
  }

  @ApiOperation({ summary: '특정 카테고리의 아이디의 상품 리스트 반환' })
  @Get(':categoryId/products')
  async getProductsByCategory(
    @Param('categoryId') categoryIdParam: string,
  ): Promise<ResponseDto<Product[]>> {
    const categoryId = Number(categoryIdParam);
    const products = await this.categoryService.findProductsById(categoryId);
    return new ResponseDto<Product[]>(
      true,
      products,
      200,
      `카테고리 아이디가 ${categoryId}인 상품 리스트 조회 완료`,
    );
  }

  @ApiOperation({ summary: '특정 카테고리의 정보 불러오기' })
  @Get(':categoryId')
  async getCategoryById(
    @Param('categoryId') categoryIdParam: string,
  ): Promise<ResponseDto<Category>> {
    const categoryId = Number(categoryIdParam);
    const category = await this.categoryService.findById(categoryId);
    return new ResponseDto<Category>(
      true,
      category,
      200,
      `카테고리 아이디가 ${categoryId}인 카테고리 조회 완료`,
    );
  }
}
