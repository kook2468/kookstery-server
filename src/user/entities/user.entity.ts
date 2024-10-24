import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'src/common/entities/base.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import * as bcrpyt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/cart/entities/cart.entity';
import { Wishlist } from 'src/wishlist/entities/wishlist.entity';
import { KookCoin } from 'src/kook-coin/entities/kook-coin.entity';

@Entity('user')
export class User extends BaseEntity {
  @ApiProperty({ description: '이메일' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: '유저 이름' })
  @Column({ unique: true })
  username: string;

  @ApiProperty({ description: '비밀번호' })
  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist;

  @OneToOne(() => KookCoin, (kookCoin) => kookCoin.user)
  kookCoin: KookCoin;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrpyt.hash(this.password, 6);
  }
}
