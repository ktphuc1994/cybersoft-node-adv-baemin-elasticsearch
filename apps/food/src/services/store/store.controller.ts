import { Controller, UsePipes } from '@nestjs/common';
import { StoreService } from './store.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EnhancedParseIntPipe } from '@app/shared/pipes/parse-int.pipe';
import {
  StoreAndMenu,
  StoreAndShippingPartner,
  ValidateShippingMethodRequest,
  validateShippingMethodRequestSchema,
} from '@app/shared/schema/store.schema';
import { FOOD_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';

@Controller()
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @MessagePattern(FOOD_PATTERN.STORE_DETAIL)
  getStoreDetail(
    @Payload(new EnhancedParseIntPipe({ fieldName: 'storeId' }))
    storeId: number,
  ): Promise<StoreAndMenu> {
    return this.storeService.getStoreDetail(storeId);
  }

  @MessagePattern(FOOD_PATTERN.STORE_AND_SHIPPING_PARTNER)
  getStoreAndShippingPartner(
    @Payload() storeId: number,
  ): Promise<StoreAndShippingPartner | null> {
    return this.storeService.getStoreAndShippingPartner(storeId);
  }

  @MessagePattern(FOOD_PATTERN.STORE_VALIDATE_SHIPPING_METHOD)
  @UsePipes(new ZodValidationPipe(validateShippingMethodRequestSchema))
  validateShippingMethod(
    @Payload() validationRequest: ValidateShippingMethodRequest,
  ) {
    return this.storeService.validateShippingMethod(validationRequest);
  }
}
