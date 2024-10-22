import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { CartItem } from './entities/cart-item.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CartItemService } from './cart-item.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiTags('카트 아이템')
@UseGuards(AuthGuard)
@Controller('cartitem')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @ApiOperation({ summary: '카트 아이템 생성' })
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
}
