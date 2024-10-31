import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsPositive,
  Length,
  Max,
  Min,
} from 'class-validator';
import { KookCoinTransactionType } from '../../common/enums/kook-coin-transaction-type.enum';

export class KookCoinTransactionDto {
  @IsNotEmpty()
  type: KookCoinTransactionType;

  @IsNotEmpty()
  @IsInt({ message: 'amount는 정수여야 합니다.' }) // 소수점이 없는 정수 검증
  @Max(1000000000000, { message: 'amount는 최대 1조를 초과할 수 없습니다.' }) // 최대값 검증
  amount: number;

  @Length(0, 50, { message: '비밀번호는 6자리 이상이여야 합니다.' })
  description: string; //트랜잭션 설명

  @IsPositive({ message: '거래 후 잔액은 양수여야 합니다.' })
  balanceAfterTransaction?: number;
}
