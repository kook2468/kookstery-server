import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule, //UserService 사용하니까 Module 임포트해두기
    JwtModule.registerAsync({
      //JwtModule을 비동기적으로 설정하는 방법. 환경변수 불러오기 때문에 이렇게 사용
      useFactory: () => ({
        //useFactory는 즉시실행함수로 객체를 반환함. 이 함수는 환경변수와 같은 외부 데이터에 기반하여 값을 반환함
        secret: process.env.JWT_SECRET || 'super_secret_key', //환경변수로 관리
        signOptions: { expiresIn: '1h' }, //토큰 만료 시간
      }),
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
