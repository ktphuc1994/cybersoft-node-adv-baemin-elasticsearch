import { Controller, UsePipes } from '@nestjs/common';
import { CartService } from './cart.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CART_PATTERN } from '@app/shared/constants/microservice-pattern.const';
import { ZodValidationPipe } from '@app/shared/pipes/zodValidation.pipe';
import {
  AddCartRequest,
  addCartRequestSchema,
  RemoveCartRequest,
  removeCartRequestSchema,
  UpdateCartRequest,
  updateCartRequestSchema,
  ValidateCartRequest,
  validateCartRequestSchema,
} from '@app/shared/schema/cart.schema';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @MessagePattern(CART_PATTERN.LIST)
  getCart(@Payload() userId: number) {
    return this.cartService.getCart(userId);
  }

  @MessagePattern(CART_PATTERN.TOTAL)
  getCartTotalItems(@Payload() userId: number): Promise<number> {
    return this.cartService.getCartTotalItem(userId);
  }

  @MessagePattern(CART_PATTERN.ADD)
  @UsePipes(new ZodValidationPipe(addCartRequestSchema))
  addToCart(@Payload() cartInfo: AddCartRequest) {
    return this.cartService.addToCart(cartInfo);
  }

  @MessagePattern(CART_PATTERN.UPDATE)
  @UsePipes(new ZodValidationPipe(updateCartRequestSchema))
  updateItemInCart(@Payload() cartInfo: UpdateCartRequest) {
    return this.cartService.updateItemInCart(cartInfo);
  }

  @MessagePattern(CART_PATTERN.REMOVE)
  @UsePipes(new ZodValidationPipe(removeCartRequestSchema))
  removeCartItem(@Payload() removeCartInfo: RemoveCartRequest) {
    return this.cartService.removeCartItem(removeCartInfo);
  }

  @MessagePattern(CART_PATTERN.VALIDATE)
  @UsePipes(new ZodValidationPipe(validateCartRequestSchema))
  validateCartItems(@Payload() valiateRequest: ValidateCartRequest) {
    return this.cartService.validateCartItems(valiateRequest);
  }
}
