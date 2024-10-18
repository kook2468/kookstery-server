import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
    const cart = await this.cartService.createCart(createCartDto);
    return new ResponseDto<Cart>(true, cart, 201, '카트 생성 성공');
  }
}
