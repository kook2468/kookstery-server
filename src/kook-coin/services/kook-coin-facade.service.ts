import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
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
    manager?: EntityManager,
  ): Promise<KookCoin | null> {
    const queryRunner = manager ? null : this.dataSource.createQueryRunner();
    if (queryRunner) {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    let kookCoin = null;

    try {
      //0. kookCoin 가져오기
      kookCoin = await this.kookCoinService.findByUserId(userId);

      //1. 트랜잭션 기록 (KookCoinRecord 생성)
      await this.kookCoinRecordService.recordTransaction(
        kookCoin,
        dto,
        manager || queryRunner.manager,
      );

      //2. KookCoin의 balance 업데이트
      kookCoin = await this.kookCoinService.updateBalence(
        kookCoin,
        dto,
        manager || queryRunner.manager,
      );

      //모든 작업이 성공하면 커밋
      if (queryRunner) {
        await queryRunner.commitTransaction();
      }
    } catch (error) {
      console.log('handleKookCoinTransaction() error', error);
      // 오류 발생시 롤백
      if (queryRunner) {
        await queryRunner.rollbackTransaction();
      }
      throw new InternalServerErrorException(
        'KookCoin을 업데이트 하는데 문제가 발생했습니다.',
      );
    } finally {
      //연결 해제
      if (queryRunner) {
        await queryRunner.release();
      }
    }

    return kookCoin;
  }
}
