import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

/**
 *  Body 없이 전달 시 배송지 삭제
 *  shippingAddressId 포함 전달 시 배송지 업데이트
 * */

export class UpdateCartShippingAddressDto {
  @IsOptional()
  @IsNumber({}, { message: '배송지 ID는 숫자여야 합니다.' })
  shippingAddressId: number;
}
