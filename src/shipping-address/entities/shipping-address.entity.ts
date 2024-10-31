import { IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('shipping_address')
export class ShippingAddress extends BaseEntity {
  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  receiverName: string; //수신인 이름

  @IsNotEmpty()
  @Column()
  receiverPhone: string; //수신인 전화번호

  @IsNotEmpty()
  @ManyToOne(() => User, (user) => user.shippingAddresses)
  user: User;

  @IsNotEmpty()
  @Column()
  addressStreet: string; //주요 주소

  @Column()
  addressDetail?: string; //부가 주소

  @IsNotEmpty()
  @Column()
  city: string;

  @IsNotEmpty()
  @Column()
  state: string;

  @IsNotEmpty()
  @Column()
  postalCode: string;

  @IsNotEmpty()
  @Column({ default: false })
  isDefault: boolean;
}
