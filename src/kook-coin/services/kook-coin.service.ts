import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KookCoin } from '../entities/kook-coin.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

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

  async updateKookCoinBalance(
    userId: number,
    amount: number,
  ): Promise<KookCoin> {
    //사용자 찾기
    const kookCoin = await this.findByUserId(userId);

    if (!kookCoin) {
      throw new NotFoundException('KookCoin을 찾을 수 없습니다.');
    }

    kookCoin.balance += amount;

    return await this.kookCoinRepository.save(kookCoin);
  }

  async findByUserId(userId: number): Promise<KookCoin> {
    return this.kookCoinRepository.findOne({ where: { user: { id: userId } } });
  }
}
