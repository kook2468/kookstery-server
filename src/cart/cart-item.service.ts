import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const { productId, quantity } = cartItemDto;

    const cart = await this.cartService.getCurrentCart(user);
    const product = await this.productService.findById(productId);

    if (!cart) {
      // 활성화 카트 없다면 생성
      const cartDto = new CreateCartDto();
      cartDto.user = user;
      this.cartService.createNewCart(cartDto);
      console.log('@활성화 카트 생성함');
    } else {
      const cartItem = await this.cartService.findCartItemByProductId(
        cart.id,
        product.id,
      );

      if (cartItem != null) {
        // cart에 해당 product 있다면
        return this.updateCartItemQty(
          cartItem.id,
          cartItem.quantity + quantity, //기존수량+입력수량
        );
      }
    }

    if (!product) {
      throw new BadRequestException(
        '장바구니에 담을 상품이 존재하지 않습니다.',
      );
    }

    const { regularPrice, discountPrice, finalPrice } = product;

    const cartItem = this.cartItemRepository.create({
      ...cartItemDto,
      cart,
      product,
      user,
      regularPrice: regularPrice * quantity,
      discountPrice: discountPrice * quantity,
      finalPrice: finalPrice * quantity,
    });

    console.log('@엔티티 인스턴스까지는 생성함');

    return await this.cartItemRepository.save(cartItem);
  }

  async deleteCartItemOne(id: number) {
    const result = await this.cartItemRepository.delete(id);

    console.log('result : ', result);
    if (result.affected === 0) {
      //해당 아이템이 존재하지 않음
      throw new NotFoundException(
        `카트아이템 (Id = ${id}) 이 존재하지 않습니다.`,
      );
    }
  }

  async updateCartItemQty(id: number, quantity: number): Promise<CartItem> {
    //cartITem의 product 정보를 가져옴
    const { product } = await this.findById(id);
    console.log('product : ', product);
    const { regularPrice, discountPrice, finalPrice } = product;

    const result = await this.cartItemRepository.update(id, {
      quantity,
      regularPrice: regularPrice * quantity,
      discountPrice: discountPrice * quantity,
      finalPrice: finalPrice * quantity,
    });

    if (result.affected === 0) {
      throw new NotFoundException(`카트아이템 (id=${id} 이 존재하지 않습니다.`);
    }

    //업데이트 후 해당 카트 아이템을 다시 조회
    return this.findById(id);
  }

  async updateCartItemSelected(
    id: number,
    isSelected: boolean,
  ): Promise<CartItem> {
    const result = await this.cartItemRepository.update(id, { isSelected });

    if (result.affected === 0) {
      throw new NotFoundException(`카트아이템 (id=${id} 이 존재하지 않습니다.`);
    }

    //업데이트 후 해당 카트 아이템을 다시 조회
    return this.findById(id);
  }

  async findAll(userId: number): Promise<CartItem[]> {
    const [cartItems, totalCount] = await this.cartItemRepository.findAndCount({
      where: {
        cart: {
          user: {
            id: userId,
          },
        },
      },
    });
    return cartItems;
  }

  async findById(id: number): Promise<CartItem | null> {
    return this.cartItemRepository.findOneBy({ id });
  }
}
