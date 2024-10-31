import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    loginDto: LoginDto,
  ): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;

    console.log(email, password);

    //email로 User 찾기
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('입력하신 이메일이 없습니다.');

    console.log('find user : ', user);

    //비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('비밀번호가 다릅니다.');

    //비밀번호가 맞다면 jwt 토큰 발급
    const payload = { username: user.username, sub: user.id }; // 사용자의 식별 정보

    console.log('jwtSerice : ', this.jwtService);
    const token = this.jwtService.sign(payload);

    console.log('token:', token);

    return { user, token };
  }

  //사용자 로그인 여부 체크
  validateToken(token: string): { sub: number; username: string } {
    try {
      const decoded = this.jwtService.verify(token); //토큰이 유효하면 true 반환
      return decoded;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
