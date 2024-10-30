import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { EntityManager, In, Repository } from 'typeorm';
import { CartStatus } from 'src/common/enums/cart-status.enum';
import { User } from 'src/user/entities/user.entity';
import { CartItem } from './entities/cart-item.entity';
import { ShippingAddress } from 'src/shipping-address/entities/shipping-address.entity';
import { ShippingAddressService } from 'src/shipping-address/shipping-address.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @OnEvent('shippingAddress.created')
  async handleShippingAddressCreated(
    shippingAddress: ShippingAddress,
    userId: number,
  ) {
    console.log('@shippingAddress.created event 실행');
    //카트 업데이트 로직
    const cart = await this.getCurrentCart(userId);

    console.log('@cart : ', cart);

    if (!cart?.shippingAddress) {
      console.log('@배송지 없음!!');
      console.log('@shippingAddress : ', shippingAddress);
      cart.shippingAddress = shippingAddress; // 배송지 연결
      await this.cartRepository.save(cart);
    }
  }

  async createNewCart(userId: number): Promise<Cart> {
    // 기본 배송지인 shippingAddress 가져옴
    const defaultShippingAddress =
      await this.shippingAddressService.findDefaultShippingAddress(userId);

    const newCart = this.cartRepository.create({
      user: { id: userId },
      ...(defaultShippingAddress && {
        shippingAddress: defaultShippingAddress,
      }),
    });

    return this.cartRepository.save(newCart);
  }

  async getCurrentCart(userId: number): Promise<Cart | null> {
    const currentCart = await this.cartRepository.findOne({
      where: {
        user: { id: userId },
        status: In([CartStatus.ACTIVE, CartStatus.PENDING]),
      },
      relations: ['cartItems', 'shippingAddress'],
    });

    return currentCart;
  }

  async updateCartStatus(
    userId: number,
    status: CartStatus,
    manager?: EntityManager,
  ): Promise<Cart> {
    const cart = await this.getCurrentCart(userId);

    if (!cart) throw new Error('현재 활성화된 카트가 없습니다.');

    if (cart.status === CartStatus.DELETED) {
      throw new Error('삭제된 카트는 수정할 수 없습니다.');
    }

    cart.status = status;

    return manager ? manager.save(Cart, cart) : this.cartRepository.save(cart);
  }

  async updateShippingAddress(
    userId: number,
    shippingAddressId: number,
  ): Promise<Cart> {
    const cart = await this.getCurrentCart(userId);

    if (!cart) {
      throw new Error('카트를 찾을 수 없습니다.');
    }

    return this.cartRepository.save({
      ...cart,
      shippingAddress: {
        id: shippingAddressId,
      },
    });
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
