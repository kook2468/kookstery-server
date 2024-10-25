import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KookCoin } from '../entities/kook-coin.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { KookCoinTransactionDto } from '../dto/kook-coin-transaction.dto';

@Injectable()
export class KookCoinService {
  constructor(
    @InjectRepository(KookCoin)
    private readonly kookCoinRepository: Repository<KookCoin>,
  ) {}

  async createKookCoin(user: User): Promise<KookCoin> {
    const newKookCoin = this.kookCoinRepository.create({ user });
    return this.kookCoinRepository.save(newKookCoin);
  }

  async updateBalence(
    kookCoin: KookCoin,
    dto: KookCoinTransactionDto,
    manager: EntityManager,
  ): Promise<KookCoin> {
    // 사용자의 KookCoin 조회
    //const kookCoin = await this.findByUserId(userId);
    const { amount } = dto;

    if (!kookCoin) {
      throw new NotFoundException('KookCoin을 찾을 수 없습니다.');
    }

    // 잔액 업데이트
    kookCoin.balance = Number(kookCoin.balance) + amount;

    // 트랜잭션을 통해 변경사항 저장
    return manager.save(KookCoin, kookCoin);
  }

  async findByUserId(userId: number): Promise<KookCoin> {
    return this.kookCoinRepository.findOne({ where: { user: { id: userId } } });
  }
}
