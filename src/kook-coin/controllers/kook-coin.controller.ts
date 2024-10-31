import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { KookCoinFacadeService } from '../services/kook-coin-facade.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/entities/user.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { KookCoin } from '../entities/kook-coin.entity';
import { ResponseDto } from '../../common/dto/response.dto';
import { KookCoinTransactionDto } from '../dto/kook-coin-transaction.dto';
import { KookCoinService } from '../services/kook-coin.service';

@ApiTags('KookCoin')
@Controller('kook-coin')
export class KookCoinController {
  constructor(
    private readonly kookCoinFacadeService: KookCoinFacadeService,
    private readonly kookCoinService: KookCoinService,
  ) {}

  @ApiOperation({ summary: 'KookCoin 을 기록하고 balence를 업데이트' })
  @UseGuards(AuthGuard)
  @Post('/transaction')
  async processKookCoinTransaction(
    @CurrentUser() user: User,
    @Body() dto: KookCoinTransactionDto,
  ): Promise<ResponseDto<KookCoin>> {
    console.log('dto ::: ', dto);
    console.log('dto.amount type', typeof dto.amount);
    const kookCoin = await this.kookCoinFacadeService.handleKookCoinTransaction(
      user.id,
      dto,
    );

    return new ResponseDto<KookCoin>(
      true,
      kookCoin,
      200,
      '거래 내역 업데이트 성공',
    );
  }

  @ApiOperation({ summary: '로그인 유저의 KookCoin 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async getUserKookCoin(
    @CurrentUser() user: User,
  ): Promise<ResponseDto<KookCoin>> {
    const kookCoin = await this.kookCoinService.findByUserId(user.id);
    return new ResponseDto<KookCoin>(true, kookCoin, 200, 'kookCoin 조회 성공');
  }
}
