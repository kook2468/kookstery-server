/* 사용자가 상품을 처음 담을 때 카트 생성 */

import { IsNotEmpty } from 'class-validator';
import { User } from 'src/user/entities/user.entity';

export class CreateCartDto {
  @IsNotEmpty()
  user: User;
}
