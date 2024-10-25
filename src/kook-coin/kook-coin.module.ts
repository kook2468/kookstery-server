import { forwardRef, Module } from '@nestjs/common';

import { KookCoinRecordService } from './services/kook-coin-record.service';
import { KookCoinRecordController } from './controllers/kook-coin-record.controller';
import { KookCoinController } from './controllers/kook-coin.controller';
import { KookCoinService } from './services/kook-coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KookCoin } from './entities/kook-coin.entity';
import { KookCoinRecord } from './entities/kook-coin-record.entity';
import { User } from 'src/user/entities/user.entity';
import { KookCoinFacadeService } from './services/kook-coin-facade.service';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KookCoin, KookCoinRecord, User]),
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
  ],
  controllers: [KookCoinController, KookCoinRecordController],
  providers: [KookCoinService, KookCoinRecordService, KookCoinFacadeService],
  exports: [KookCoinService],
})
export class KookCoinModule {}
