import { Test, TestingModule } from '@nestjs/testing';
import { ShippingAddressController } from './shipping-address.controller';

describe('ShippingAddressController', () => {
  let controller: ShippingAddressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShippingAddressController],
    }).compile();

    controller = module.get<ShippingAddressController>(ShippingAddressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
