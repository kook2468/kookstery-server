import { BadRequestException, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { In, Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartStatus } from 'src/common/enums/cart-status.enum';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './entities/cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async createNewCart(cartDto: CreateCartDto): Promise<Cart> {
    const newCart = this.cartRepository.create(cartDto);
    return this.cartRepository.save(newCart);
  }

  async getCurrentCart(user: User): Promise<Cart | null> {
    console.log('user : ', user);
    const currentCart = await this.cartRepository.findOne({
      where: {
        user: { id: user.id },
        status: In([CartStatus.ACTIVE, CartStatus.PENDING]),
      },
      relations: ['cartItems'],
    });

    if (!currentCart) {
      throw new Error('카트를 찾을 수 없습니다.');
    }

    return currentCart;
  }

  async updateCartStatus(user: User, status: CartStatus): Promise<Cart> {
    const cart = await this.getCurrentCart(user);

    if (!cart) throw new Error('현재 활성화된 카트가 없습니다.');

    if (cart.status === CartStatus.DELETED) {
      throw new Error('삭제된 카트는 수정할 수 없습니다.');
    }

    cart.status = status;
    await this.cartRepository.save(cart); //repository 메소드 호출 이후에는 cart 변수에 모든 변경사항이 반영됨.

    return cart;
  }

  async findCartItemByProductId(
    cartId: number,
    productId: number,
  ): Promise<CartItem | null> {
    const cart = await this.cartRepository.findOne({
      where: { id: cartId },
      relations: ['cartItems'],
    });

    if (!cart) {
      //카트가 존재하지 않는 경우
      return null;
    }

    // cartItems에서 productId가 일치하는 CartItem 찾기
    const cartItem = cart.cartItems.find(
      (item) => item.product.id === productId,
    );

    return cartItem; // 일치하는 CartItem이 있으면 ID 반환, 없으면 null 반환
  }
}
