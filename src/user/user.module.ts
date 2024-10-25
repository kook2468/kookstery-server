import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { KookCoinModule } from 'src/kook-coin/kook-coin.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => KookCoinModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 다른 모듈에서 사용할 수 있도록 내보냄
})
export class UserModule {}
