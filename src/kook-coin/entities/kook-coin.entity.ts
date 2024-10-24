import { IsDecimal, Min } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('kook_coin')
export class KookCoin extends BaseEntity {
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  //precision : 소수점포함자리수, scale : 소수점이하자리수
  @Column('decimal', { precision: 10, scale: 0, default: 0 })
  @IsDecimal({ decimal_digits: '0,0' }) // 소수점이 없는 정수 검증
  @Min(0)
  balance: number;
}
