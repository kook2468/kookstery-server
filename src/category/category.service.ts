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

  async findById(categoryId: number) {
    return this.categoryRepository.findOneBy({ id: categoryId });
  }
}
