import { Module } from '@nestjs/common';

import { KookCoinRecordService } from './services/kook-coin-record.service';
import { KookCoinRecordController } from './controllers/kook-coin-record.controller';
import { KookCoinController } from './controllers/kook-coin.controller';
import { KookCoinService } from './services/kook-coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KookCoin } from './entities/kook-coin.entity';
import { KookCoinRecord } from './entities/kook-coin-record.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KookCoin, KookCoinRecord, User])],
  controllers: [KookCoinController, KookCoinRecordController],
  providers: [KookCoinService, KookCoinRecordService],
  exports: [KookCoinService],
})
export class KookCoinModule {}
