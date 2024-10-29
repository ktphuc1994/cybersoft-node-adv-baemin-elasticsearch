import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@app/shared/constants/microservice-pattern.const';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(ORDER_PATTERN.GET_INFO_BY_FOOD_ID)
  getInformationByFoodIds() {
    return this.orderService.getInformationByFoodIds();
  }
}
