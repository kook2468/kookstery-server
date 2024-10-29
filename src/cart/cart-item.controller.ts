import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CartItemService } from './cart-item.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { plainToClass } from 'class-transformer';
import { Cart } from './entities/cart.entity';

@ApiTags('카트 아이템')
@UseGuards(AuthGuard)
@Controller('cart-items')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiOperation({ summary: '카트 아이템 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async createCartItem(
    @CurrentUser() user: User,
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<ResponseDto<CartItem>> {
    console.log('createCartItem() ==>');
    const cartItem = await this.cartItemService.createCartItemOne(
      user,
      createCartItemDto,
    );
    return new ResponseDto<CartItem>(
      true,
      cartItem,
      201,
      '카트 아이템 생성 완료',
    );
  }

  @ApiOperation({ summary: '카트 아이템 삭제' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCartItem(@Param('id') id: string): Promise<ResponseDto<null>> {
    await this.cartItemService.deleteCartItemOne(Number(id));
    return new ResponseDto<null>(true, null, 204); //응답 본문이 필요 없을때는 204 메세지 사용
  }

  @ApiOperation({ summary: '카트 아이템 수량 변경' })
  @UseGuards(AuthGuard)
  @Patch('quantity')
  async updateQuantity(
    @Body() cartItemDto: UpdateCartItemDto,
  ): Promise<ResponseDto<CartItem>> {
    // 기존과 같은 수량의 경우는 프론트에서 요청을 보내지 않을거임
    const { id, quantity } = cartItemDto;
    const cartItem = await this.cartItemService.updateCartItemQty(id, quantity);
    return new ResponseDto<CartItem>(
      true,
      cartItem,
      200,
      `카트아이템(id=${id}) 수량 변경 성공`,
    );
  }

  @ApiOperation({ summary: '카트 아이템 선택/선택취소' })
  @UseGuards(AuthGuard)
  @Patch('select')
  async updateSelected(
    @Body() cartItemDto: UpdateCartItemDto,
  ): Promise<ResponseDto<CartItem>> {
    const { id, isSelected } = cartItemDto;
    const cartItem = await this.cartItemService.updateCartItemSelected(
      id,
      isSelected,
    );
    return new ResponseDto<CartItem>(
      true,
      cartItem,
      200,
      `카트아이템 선택 여부 ${isSelected} 변경 성공`,
    );
  }

  @ApiOperation({ summary: '전체 카트 아이템 조회' })
  @UseGuards(AuthGuard)
  @Get('select')
  async fetchAllUserCartItems(
    @CurrentUser() user: User,
  ): Promise<ResponseDto<CartItem[]>> {
    const cartItems = await this.cartItemService.findAll(user.id);
    return new ResponseDto<CartItem[]>(
      true,
      cartItems,
      200,
      '전체 카트 아이템 조회 성공',
    );
  }
}
