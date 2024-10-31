import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../../common/entities/base.entity';
import { BeforeInsert, Column, Entity, OneToMany, OneToOne } from 'typeorm';
import * as bcrpyt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Wishlist } from '../../wishlist/entities/wishlist.entity';
import { KookCoin } from '../../kook-coin/entities/kook-coin.entity';
import { ShippingAddress } from '../../shipping-address/entities/shipping-address.entity';

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

  @OneToMany(() => ShippingAddress, (shippingAddress) => shippingAddress.user)
  shippingAddresses: ShippingAddress[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrpyt.hash(this.password, 6);
  }
}
