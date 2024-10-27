import { Controller } from '@nestjs/common';
import { CartService } from './cart.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CART_PATTERN } from '@app/shared/constants/microservice-pattern.const';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern(CART_PATTERN.LIST)
  getCart(@Payload() userId: number) {
    return this.cartService.getCart(userId);
  }
}
