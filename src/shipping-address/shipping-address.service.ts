import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShippingAddress } from './entities/shipping-address.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ShippingAddressService {
  constructor(
    @InjectRepository(ShippingAddress)
    private readonly shippingAddressRepository: Repository<ShippingAddress>,
    private readonly dataSource: DataSource, //트랜잭션 처리를 위해 로드
    private readonly eventEmitter: EventEmitter2, //이벤트 처리를 위해 로드
  ) {}

  async deleteShippingAddressById(addressId: number): Promise<void> {
    const result = await this.shippingAddressRepository.delete(addressId);

    console.log('result : ', result);
    if (result.affected === 0) {
      //해당 배송지가 존재하지 않음.
      throw new NotFoundException(
        `배송지(Id = ${addressId}) 이 존재하지 않습니다.`,
      );
    }
  }

  async handleShippingAddressCreate(
    userId: number,
    addressDto: CreateShippingAddressDto,
  ): Promise<ShippingAddress> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      const { addresses: existAddresses } = await this.findAllByUserId(userId);

      if (existAddresses.length >= 10) {
        throw new BadRequestException(
          '배송지는 최대 10개로 관리할 수 있습니다.',
        );
      }

      if (existAddresses.length === 0) {
        // 처음 배송지 생성 시 기본배송지로 설정
        addressDto.isDefault = true;
      } else if (addressDto.isDefault) {
        // 기존 기본배송지 true인 배송지는 false로 업데이트
        await this.resetDefaultShippingAddress(userId, manager);
      }

      const newAddress = manager.create(ShippingAddress, {
        ...addressDto,
        user: { id: userId },
      });

      const savedAddress =
        await this.shippingAddressRepository.save(newAddress);

      //현재 cart에 연결된 shippingAddress 없다면 업데이트 하는 이벤트 발생시킴
      this.eventEmitter.emit('shippingAddress.created', savedAddress, userId);

      return savedAddress;
    });
  }

  async handleShippingAddressUpdate(
    userId: number,
    addressId: number,
    addressDto: UpdateShippingAddressDto,
  ): Promise<ShippingAddress> {
    return await this.dataSource.transaction(async (manager: EntityManager) => {
      if (addressDto.isDefault) {
        // 기존 기본배송지 true인 배송지는 false로 업데이트
        await this.resetDefaultShippingAddress(userId, manager);
      }

      const result = await manager.update(
        ShippingAddress,
        addressId,
        addressDto,
      );

      if (result.affected === 0) {
        throw new NotFoundException(
          `배송지 (id=${addressId} 이 존재하지 않습니다.`,
        );
      }

      //업데이트 후 해당 배송지를 다시 조회
      return await manager.findOne(ShippingAddress, {
        where: { id: addressId },
      });
    });
  }

  //트랜잭션 내에서 사용함.
  private async resetDefaultShippingAddress(
    userId: number,
    manager: EntityManager,
  ): Promise<void> {
    // 기존 기본 배송지 찾아서 isDefault를 false로 설정
    const defaultAddress = await this.findDefaultShippingAddress(userId);
    /*await manager.findOne(ShippingAddress, {
      where: { user: { id: userId }, isDefault: true },
    });
    */

    if (defaultAddress) {
      defaultAddress.isDefault = false;
      await manager.save(defaultAddress);
    }
  }

  async findDefaultShippingAddress(userId: number): Promise<ShippingAddress> {
    return this.shippingAddressRepository.findOne({
      where: { user: { id: userId }, isDefault: true },
    });
  }

  async findAllByUserId(
    userId: number,
  ): Promise<{ addresses: ShippingAddress[]; totalCount: number }> {
    const [addresses, totalCount] =
      await this.shippingAddressRepository.findAndCount({
        where: {
          user: {
            id: userId,
          },
        },
      });

    return { addresses, totalCount };
  }

  async findById(addressId: number): Promise<ShippingAddress> {
    return this.shippingAddressRepository.findOneBy({ id: addressId });
  }
}
