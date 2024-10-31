import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async createMultiple(products: CreateProductDto[]): Promise<Product[]> {
    const categoryIds = products.map((product) => product.categoryId);

    // 필요한 모든 카테고리를 미리 로드
    const categories = await this.categoryService.findByIds(categoryIds);
    const categoryMap = new Map(
      categories.map((category) => [category.id, category]),
    );

    const newProducts = products.map((productDto) => {
      const { categoryId } = productDto;

      const category = categoryMap.get(categoryId);
      if (!category) {
        throw new BadRequestException(
          `카테고리 아이디 ${categoryId}가 존재하지 않습니다.`,
        );
      }

      return this.productRepository.create({
        ...productDto,
        category,
      });
    });

    if (!newProducts.length) {
      throw new BadRequestException('요청받은 데이터가 없습니다.');
    }

    return this.productRepository.save(newProducts);
  }

  async findById(id: number): Promise<Product | null> {
    return this.productRepository.findOneBy({ id });
  }
}
