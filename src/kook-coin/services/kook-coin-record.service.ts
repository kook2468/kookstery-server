import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KookCoinRecord } from '../entities/kook-coin-record.entity';
import { Between, EntityManager, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { KookCoinTransactionDto } from '../dto/kook-coin-transaction.dto';
import { KookCoin } from '../entities/kook-coin.entity';
import { KookCoinRecordFilter } from 'src/common/enums/kook-coin-record-filter.enum';

@Injectable()
export class KookCoinRecordService {
  constructor(
    @InjectRepository(KookCoinRecord)
    private readonly kookCoinRecordRepository: Repository<KookCoinRecord>,
  ) {}

  /**
   * 트랜잭션 기록
   */
  async recordTransaction(
    kookCoin: KookCoin,
    dto: KookCoinTransactionDto,
    manager: EntityManager,
  ): Promise<KookCoinRecord> {
    const { amount, type, description } = dto;
    console.log('@typeof amount : ', typeof amount);
    console.log('@typeof kookCoin.balence : ', typeof kookCoin.balance);

    const record = this.kookCoinRecordRepository.create({
      kookCoin,
      amount,
      type,
      description,
      balanceAfterTransaction: Number(kookCoin.balance) + amount, //거래 후 잔액
    });

    if (record.balanceAfterTransaction < 0) {
      throw new BadRequestException('거래 후 잔액은 0원 이상이여야 합니다.');
    }

    return manager.save(KookCoinRecord, record);
  }

  async getKookCoinRecords(
    userId: number,
    filter: KookCoinRecordFilter,
    page: number,
    limit: number,
    year: number,
    month: number,
  ): Promise<{ records: KookCoinRecord[]; totalCount: number }> {
    let dateCondition: any = {};

    // 월 필터 조건 설정
    if (year && month) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(
        year,
        month - 1,
        new Date(year, month, 0).getDate(),
        23,
        59,
        59,
      );
      dateCondition = Between(startOfMonth, endOfMonth);
    } else if (year) {
      // 연도 필터 조건 설정
      const startOfYear = new Date(year, 0, 1);
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);
      dateCondition = Between(startOfYear, endOfYear);
    }

    const [records, totalCount] =
      await this.kookCoinRecordRepository.findAndCount({
        where: {
          kookCoin: {
            user: { id: userId },
            ...(filter !== KookCoinRecordFilter.ALL && {
              createdDate: dateCondition,
            }),
          },
        },
        take: limit, //가져올 레코드 수
        skip: (page - 1) * limit, //건너뛸 레코드 수
      });

    return { records, totalCount };
  }
}
