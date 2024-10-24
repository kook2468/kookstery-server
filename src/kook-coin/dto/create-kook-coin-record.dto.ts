import { IsNotEmpty, Length } from 'class-validator';
import { KookCoinTransactionType } from 'src/common/enums/kook-coin-transaction-type.enum';

export class CreateKookCoinRecordDto {
  @IsNotEmpty()
  type: KookCoinTransactionType;

  @IsNotEmpty()
  amount: number;

  @Length(0, 50, { message: '비밀번호는 6자리 이상이여야 합니다.' })
  description: string; //트랜잭션 설명
}
