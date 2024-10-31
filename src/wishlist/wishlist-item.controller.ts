import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WishlistItemService } from './wishlist-item.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateWishlistItemDto } from './dto/create-wishlist-item.dto';
import { WishlistItem } from './entities/wishlist-item.entity';
import { ResponseDto } from '../common/dto/response.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/entities/user.entity';
import { WishlistService } from './wishlist.service';

@ApiTags('위시리스트 아이템')
@Controller('wishlist-items')
export class WishlistItemController {
  constructor(
    private readonly wishlistItemService: WishlistItemService,
    private readonly wishlistService: WishlistService,
  ) {}

  @ApiOperation({ summary: '위시리스트 아이템 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async createWishlistItem(
    @CurrentUser() user: User,
    @Body() wishlistItemDto: CreateWishlistItemDto,
  ): Promise<ResponseDto<WishlistItem>> {
    const wishlistItem = await this.wishlistItemService.createWishlistItemOne(
      user,
      wishlistItemDto,
    );
    return new ResponseDto<WishlistItem>(
      true,
      wishlistItem,
      200,
      '위시리스트 아이템 생성 성공',
    );
  }

  @ApiOperation({ summary: '위시리스트 아이템 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async getUserWishlistItems(
    @CurrentUser() user: User,
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '10',
  ): Promise<ResponseDto<{ items: WishlistItem[]; totalCount: number }>> {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);

    const wishlist = await this.wishlistService.findOrCreateUserWishlist(
      user.id,
    );

    const { items, totalCount } =
      await this.wishlistItemService.getWishlistItems(wishlist.id, page, limit);

    return new ResponseDto<{ items: WishlistItem[]; totalCount: number }>(
      true,
      { items, totalCount },
      200,
      '위시리스트 아이템 조회 성공',
    );
  }

  @ApiOperation({ summary: '위시리스트 아이템 삭제' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteWishlistItem(
    @Param('id') itemId: string,
  ): Promise<ResponseDto<null>> {
    await this.wishlistItemService.deleteWishlistItemOne(Number(itemId));

    return new ResponseDto<null>(
      true,
      null,
      200,
      `위시리스트 아이템(id=${itemId}) 삭제 성공`,
    );
  }
}
