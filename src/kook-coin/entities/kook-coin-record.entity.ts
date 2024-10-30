import { Column, Entity, ManyToOne } from 'typeorm';
import { KookCoin } from './kook-coin.entity';
import { KookCoinTransactionType } from 'src/common/enums/kook-coin-transaction-type.enum';
import { IsPositive, Length } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity('kook_coin_record')
export class KookCoinRecord extends BaseEntity {
  @ManyToOne(() => KookCoin, { eager: true })
  kookCoin: KookCoin;

  @Column({ type: 'enum', enum: KookCoinTransactionType })
  type: KookCoinTransactionType; //트랜잭션 종류(충전, 소비, 취소)

  @Column('decimal', { precision: 10, scale: 0, nullable: false })
  amount: number; //변화된 재화 양 (양수/음수 가능)

  @Column('decimal', { precision: 10, scale: 0, nullable: false })
  @IsPositive()
  balanceAfterTransaction: number;

  @Column({ nullable: true })
  description: string; //트랜잭션 설명
}
