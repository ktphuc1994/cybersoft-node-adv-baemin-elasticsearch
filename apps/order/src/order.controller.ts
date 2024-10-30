import { Controller, UsePipes } from '@nestjs/common';
import { OrderService } from './order.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ORDER_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import {
  CreateOrderRequest,
  createOrderRequestSchema,
  OrderDetailRequest,
  orderDetailRequestSchema,
  PlaceOrderRequest,
} from '@app/shared/schema/order.schema';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';

@Controller()
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @MessagePattern(ORDER_PATTERN.VALIDATE_CREATE_BODY)
  @UsePipes(new ZodValidationPipe(createOrderRequestSchema))
  validateCreateBody(@Payload() orderInfo: CreateOrderRequest) {
    return orderInfo;
  }

  @MessagePattern(ORDER_PATTERN.PLACE_ORDER)
  placeOrder(@Payload() requestInfo: PlaceOrderRequest) {
    return this.orderService.placeOrder(requestInfo);
  }

  @MessagePattern(ORDER_PATTERN.DETAIL)
  @UsePipes(new ZodValidationPipe(orderDetailRequestSchema))
  getOrderDetail(@Payload() requestInfo: OrderDetailRequest) {
    return this.orderService.getOrderDetail(requestInfo);
  }
}
