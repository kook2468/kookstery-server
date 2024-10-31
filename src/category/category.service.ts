import { BadRequestException, Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[] | null> {
    return this.categoryRepository.find();
  }

  async createMultiple(categories: CreateCategoryDto[]): Promise<Category[]> {
    const newCategories = categories.map((categoryDto) =>
      this.categoryRepository.create(categoryDto),
    );

    if (!newCategories) {
      throw new BadRequestException('요청받은 데이터가 없습니다.');
    }

    return this.categoryRepository.save(newCategories);
  }

  async findByIds(categoryIds: number[]): Promise<Category[]> {
    return this.categoryRepository.findByIds(categoryIds);
  }

  async findProductsById(categoryId: number): Promise<Product[]> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'], // 카테고리에 속한 상품 목록을 불러옵니다.
    });

    if (!category) {
      throw new Error(`카테고리 아이디 ${categoryId}가 존재하지 않습니다.`);
    }

    return category.products;
  }
}
