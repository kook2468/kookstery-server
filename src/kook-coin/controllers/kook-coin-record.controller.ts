import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { KookCoinRecordService } from '../services/kook-coin-record.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { ResponseDto } from 'src/common/dto/response.dto';
import { KookCoinRecord } from '../entities/kook-coin-record.entity';
import { KookCoinRecordFilter } from 'src/common/enums/kook-coin-record-filter.enum';

@ApiTags('KookCoin 기록')
@Controller('kook-coin-record')
export class KookCoinRecordController {
  constructor(private readonly kookCoinRecordService: KookCoinRecordService) {}

  /**
   * @description 조건별 코인 사용기록 조회
   * @param user
   * @param filter ALL, DATE, TRANSACTIONTYPE(추가예정)
   * @param pageStr
   * @param limitStr
   * @param yearStr
   * @param monthStr
   * @returns
   */
  @ApiOperation({ summary: '조건별 코인 사용 기록 조회' })
  @UseGuards(AuthGuard)
  @Get('')
  async getKookCoinRecords(
    @CurrentUser() user: User,
    @Query('filter') filter: KookCoinRecordFilter = KookCoinRecordFilter.ALL,
    @Query('page') pageStr: string = '1',
    @Query('limit') limitStr: string = '10',
    @Query('y') yearStr?: string,
    @Query('m') monthStr?: string,
  ): Promise<ResponseDto<{ records: KookCoinRecord[]; totalCount: number }>> {
    const page = parseInt(pageStr, 10);
    const limit = parseInt(limitStr, 10);
    const year = yearStr ? parseInt(yearStr, 10) : undefined;
    const month = monthStr ? parseInt(monthStr, 10) : undefined;

    const { records, totalCount } =
      await this.kookCoinRecordService.getKookCoinRecords(
        user.id,
        filter,
        page,
        limit,
        year,
        month,
      );

    return new ResponseDto<{ records: KookCoinRecord[]; totalCount: number }>(
      true,
      { records, totalCount },
      200,
      '코인 사용 기록 조회 성공',
    );
  }
}
