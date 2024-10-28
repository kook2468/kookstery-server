import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { updateCartStatusDto } from './dto/update-cart-status.dto';
import { classToPlain, plainToClass, plainToInstance } from 'class-transformer';
import { CartDto } from './dto/cart.dto';

@ApiTags('카트')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: '카트 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async createCart(@CurrentUser() user: User): Promise<ResponseDto<Cart>> {
    const createCartDto = new CreateCartDto();
    createCartDto.user = user;
    const cart = await this.cartService.createNewCart(createCartDto);
    return new ResponseDto<Cart>(true, cart, 201, '카트 생성 성공');
  }

  @ApiOperation({ summary: '로그인한 유저의 현재 카트 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async fetchCart(@CurrentUser() user: User): Promise<ResponseDto<CartDto>> {
    const cart = await this.cartService.getCurrentCart(user);
    return new ResponseDto<CartDto>(
      true,
      new CartDto(cart),
      200,
      '카트 조회 성공',
    );
  }

  @ApiOperation({ summary: '카트 상태 업데이트' })
  @UseGuards(AuthGuard)
  @Patch('/status')
  async handleUpdateCartStatus(
    @CurrentUser() user: User,
    @Body() updateCartStatusDto: updateCartStatusDto,
  ): Promise<ResponseDto<Cart>> {
    const { status } = updateCartStatusDto;
    const cart = await this.cartService.updateCartStatus(user, status);
    return new ResponseDto<Cart>(
      true,
      cart,
      201,
      `카트 상태 변경 성공 - ${status}`,
    );
  }
}
