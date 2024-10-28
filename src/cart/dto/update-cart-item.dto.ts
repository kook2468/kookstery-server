import { IsBoolean, IsNotEmpty, IsOptional, IsPositive } from 'class-validator';

export class UpdateCartItemDto {
  @IsNotEmpty()
  id: number;

  @IsOptional()
  @IsPositive() //양수인지 검증
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  isSelected?: boolean;
}
