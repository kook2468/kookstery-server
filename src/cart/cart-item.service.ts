import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { User } from 'src/user/entities/user.entity';
import { CartService } from './cart.service';
import { ProductService } from 'src/product/product.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
  ) {}

  async createCartItemOne(
    user: User,
    cartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    const { productId } = cartItemDto;

    const cart = await this.cartService.getCurrentCart(user);

    //활성화 카트 없다면 생성
    if (!cart) {
      const cartDto = new CreateCartDto();
      cartDto.user = user;
      this.cartService.createNewCart(cartDto);
    }

    const product = await this.productService.findById(productId);

    if (!product) {
      throw new BadRequestException(
        '장바구니에 담을 상품이 존재하지 않습니다.',
      );
    }

    const cartItem = this.cartItemRepository.create({
      ...cartItemDto,
      cart,
      product,
    });

    return await this.cartItemRepository.save(cartItem);
  }
}
