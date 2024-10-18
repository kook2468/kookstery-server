import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/user/entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res,
  ): Promise<ResponseDto<{ user: User }>> {
    const { user, token } = await this.authService.validateUser(loginDto);

    //쿠키 설정
    res.cookie('jwt', token, {
      httpOnly: true, //클라이언트에서 js에 접근할 수 없도록 설정
      secure: process.env.NODE_ENV === 'production', //HTTPS를 사용하는 경우에만 사용
      maxAge: 3600000, //쿠키 만료 시간 (1시간)
    });

    return new ResponseDto(true, { user });
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Res() res: Response): ResponseDto<null> {
    res.clearCookie('jwt');

    return new ResponseDto<null>(true, null, 200, '로그아웃 성공');
  }

  @UseGuards(AuthGuard)
  @Get('currentUser')
  @ApiOperation({ summary: '현재 로그인한 유저 불러오기' })
  getCurrentUser(@CurrentUser() user: User): ResponseDto<User> {
    return new ResponseDto<User>(true, user, 200, '프로필 조회 성공');
  }
}
