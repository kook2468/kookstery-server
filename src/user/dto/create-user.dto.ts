import { IsEmail, Length } from 'class-validator';
import { Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '이메일' })
  @Index()
  @IsEmail(undefined, { message: '이메일 주소가 잘못되었습니다.' })
  @Length(1, 255, { message: '이메일 주소는 비워둘 수 없습니다.' })
  email: string;

  @ApiProperty({ description: '유저 이름' })
  @Index()
  @Length(3, 32, { message: '사용자 이름은 3자 이상이어야 합니다.' })
  username: string;

  @ApiProperty({ description: '비밀번호' })
  @Length(6, 255, { message: '비밀번호는 6자리 이상이어야 합니다.' })
  password: string;
}
