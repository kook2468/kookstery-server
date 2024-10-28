import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateShippingAddressDto {
  @IsNotEmpty()
  @Length(0, 20, { message: '배송지 이름은 20자 이하여야 합니다.' })
  name: string;

  @IsNotEmpty()
  @Length(0, 20, { message: '수신인 이름은 20자 이하여야 합니다.' })
  receiverName?: string;

  @IsNotEmpty()
  receiverPhone?: string;

  @IsNotEmpty()
  @Length(0, 255, { message: '도로명 주소는 255자를 넘을 수 없습니다.' })
  addressStreet: string; //도로명 주소

  @IsOptional()
  @Length(0, 255, { message: '추가 주소는 255자를 넘을 수 없습니다.' })
  addressDetail?: string; //부가 주소

  @IsNotEmpty()
  @Length(0, 50, { message: '시/군/구는 50자를 넘을 수 없습니다.' })
  city: string;

  @IsNotEmpty()
  @Length(0, 10, { message: '도는 10자를 넘길 수 없습니다.' })
  state: string;

  @IsNotEmpty()
  @Length(0, 20, { message: '우편번호는 20자를 넘길 수 없습니다.' })
  postalCode: string;

  @IsOptional()
  isDefault: boolean;
}
