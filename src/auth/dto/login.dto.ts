import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '이메일' })
  @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다.' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다.' })
  email: string;

  @ApiProperty({ description: '비밀번호' })
  @Length(6, 255, { message: '비밀번호는 6자리 이상이여야 합니다.' })
  password: string;
}
