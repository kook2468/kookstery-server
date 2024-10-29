import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { KookCoinRecordService } from './kook-coin-record.service';
import { KookCoinService } from './kook-coin.service';
import { KookCoin } from '../entities/kook-coin.entity';
import { User } from 'src/user/entities/user.entity';
import { KookCoinTransactionDto } from '../dto/kook-coin-transaction.dto';

@Injectable()
export class KookCoinFacadeService {
  constructor(
    private dataSource: DataSource,
    private readonly kookCoinService: KookCoinService,
    private readonly kookCoinRecordService: KookCoinRecordService,
  ) {}

  async handleKookCoinTransaction(
    userId: number,
    dto: KookCoinTransactionDto,
  ): Promise<KookCoin | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let kookCoin = null;

    try {
      //0. kookCoin 가져오기
      kookCoin = await this.kookCoinService.findByUserId(userId);

      //1. 트랜잭션 기록 (KookCoinRecord 생성)
      await this.kookCoinRecordService.recordTransaction(
        kookCoin,
        dto,
        queryRunner.manager,
      );

      //2. KookCoin의 balance 업데이트
      kookCoin = await this.kookCoinService.updateBalence(
        kookCoin,
        dto,
        queryRunner.manager,
      );

      //모든 작업이 성공하면 커밋
      await queryRunner.commitTransaction();
    } catch (error) {
      // 오류 발생시 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      //연결 해제
      await queryRunner.release();
    }

    return kookCoin;
  }
}
