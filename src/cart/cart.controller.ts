import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { ResponseDto } from '../common/dto/response.dto';
import { CartService } from './cart.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartDto } from './dto/cart.dto';
import { UpdateCartShippingAddressDto } from './dto/update-cart-shipping-address.dto';
import { UpdateCartStatusDto } from './dto/update-cart-status.dto';

@ApiTags('카트')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: '카트 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async createCart(@CurrentUser() user: User): Promise<ResponseDto<Cart>> {
    const cart = await this.cartService.createNewCart(user.id);
    return new ResponseDto<Cart>(true, cart, 201, '카트 생성 성공');
  }

  @ApiOperation({ summary: '로그인한 유저의 현재 카트 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async fetchCart(@CurrentUser() user: User): Promise<ResponseDto<CartDto>> {
    const cart = await this.cartService.getCurrentCart(user.id);

    return new ResponseDto<CartDto>(
      true,
      cart ? new CartDto(cart) : null,
      200,
      '카트 조회 성공',
    );
  }

  @ApiOperation({ summary: '카트 상태 업데이트' })
  @UseGuards(AuthGuard)
  @Patch('/status')
  async handleUpdateCartStatus(
    @CurrentUser() user: User,
    @Body() updateCartStatusDto: UpdateCartStatusDto,
  ): Promise<ResponseDto<Cart>> {
    const { status } = updateCartStatusDto;
    const cart = await this.cartService.updateCartStatus(user.id, status);
    return new ResponseDto<Cart>(
      true,
      cart,
      201,
      `카트 상태 변경 성공 - ${status}`,
    );
  }

  @ApiOperation({ summary: '현재 카트 배송지 수정/삭제' })
  @UseGuards(AuthGuard)
  @Patch('/shipping-address')
  async handleUpdateCartShippingAddress(
    @CurrentUser() user: User,
    @Body() updateShippingAddressDto: UpdateCartShippingAddressDto,
  ): Promise<ResponseDto<Cart>> {
    const updatedCart = await this.cartService.updateShippingAddress(
      user.id,
      updateShippingAddressDto.shippingAddressId,
    );

    return new ResponseDto<Cart>(true, updatedCart, 200, '카트 업데이트 성공');
  }
}
