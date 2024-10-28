import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShippingAddressService } from './shipping-address.service';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ShippingAddress } from './entities/shipping-address.entity';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';

@ApiTags('배송지')
@Controller('shipping-address')
export class ShippingAddressController {
  constructor(
    private readonly shippingAddressService: ShippingAddressService,
  ) {}

  @ApiOperation({ summary: '배송지 생성' })
  @UseGuards(AuthGuard)
  @Post()
  async createShippinAddress(
    @CurrentUser() user: User,
    @Body() addressDto: CreateShippingAddressDto,
  ): Promise<ResponseDto<ShippingAddress>> {
    const newAddress =
      await this.shippingAddressService.handleShippingAddressCreate(
        user.id,
        addressDto,
      );
    return new ResponseDto<ShippingAddress>(
      true,
      newAddress,
      200,
      '배송지 생성 성공',
    );
  }

  @ApiOperation({ summary: '전체 배송지 조회' })
  @UseGuards(AuthGuard)
  @Get()
  async getAllShippingAddresses(
    @CurrentUser() user: User,
  ): Promise<
    ResponseDto<{ addresses: ShippingAddress[]; totalCount: number }>
  > {
    const { addresses, totalCount } =
      await this.shippingAddressService.findAllByUserId(user.id);
    return new ResponseDto<{
      addresses: ShippingAddress[];
      totalCount: number;
    }>(true, { addresses, totalCount }, 200, '전체 배송지 조회 성공');
  }

  @ApiOperation({ summary: '배송지 수정' })
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateShippingAddress(
    @CurrentUser() user: User,
    @Param('id') addressIdStr: string,
    @Body() addressDto: UpdateShippingAddressDto,
  ): Promise<ResponseDto<ShippingAddress>> {
    const addressId = parseInt(addressIdStr, 10);
    const address =
      await this.shippingAddressService.handleShippingAddressUpdate(
        user.id,
        addressId,
        addressDto,
      );
    return new ResponseDto<ShippingAddress>(
      true,
      address,
      200,
      `배송지(id=${addressId}) 업데이트 성공`,
    );
  }

  @ApiOperation({ summary: '배송지 삭제' })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteShippingAddress(
    @Param('id') addressIdStr: string,
  ): Promise<ResponseDto<null>> {
    const addressId = parseInt(addressIdStr, 10);
    await this.shippingAddressService.deleteShippingAddressById(addressId);
    return new ResponseDto<null>(true, null, 200, '배송지 삭제 성공');
  }
}
