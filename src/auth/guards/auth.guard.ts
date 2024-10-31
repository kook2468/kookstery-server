import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.jwt; // 쿠키에서 토큰을 가져옴

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      // jwt 검증하고 사용자 정보 디코딩
      const decoded = this.authService.validateToken(token);
      const userId = decoded.sub;

      //사용자 조회
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new UnauthorizedException('유효하지 않은 사용자입니다.');
      }

      //req.user에 사용자 정보 설정
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }
}
