import { ORDER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ORDER_SERVICE_NAME } from '@app/shared/constants/microservice.const';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_SERVICE_NAME) private orderMicroservice: ClientProxy,
  ) {}

  getInformationByFoodIds() {
    return this.orderMicroservice.send(ORDER_PATTERN.GET_INFO_BY_FOOD_ID, '');
  }
}
